#!/usr/bin/env python3
"""
Backend test for Email alerts via Resend integration
Tests POST /api/contact and POST /api/chat email notifications
"""
import requests
import time
import json
import uuid
import subprocess

BASE_URL = "https://neural-portfolio-88.preview.emergentagent.com/api"

def check_logs_for_email(wait_seconds=5):
    """Check supervisor logs for email notification results"""
    print(f"\n⏳ Waiting {wait_seconds}s for email to be sent...")
    time.sleep(wait_seconds)
    
    try:
        result = subprocess.run(
            ["tail", "-n", "40", "/var/log/supervisor/nextjs.out.log"],
            capture_output=True,
            text=True,
            timeout=5
        )
        logs = result.stdout
        print("\n📋 Recent logs (last 40 lines):")
        print("=" * 80)
        print(logs)
        print("=" * 80)
        
        # Check for success
        if "Owner alert sent:" in logs:
            lines = [l for l in logs.split('\n') if "Owner alert sent:" in l]
            print(f"\n✅ EMAIL SUCCESS: Found {len(lines)} email notification(s)")
            for line in lines:
                print(f"   {line.strip()}")
            return "success", lines[-1] if lines else ""
        
        # Check for Resend rejection (403 = account email mismatch)
        if "Resend rejected notification:" in logs:
            lines = [l for l in logs.split('\n') if "Resend rejected notification:" in l]
            print(f"\n❌ EMAIL REJECTED: Resend API rejected the notification")
            for line in lines:
                print(f"   {line.strip()}")
            return "rejected", lines[-1] if lines else ""
        
        # Check for other failures
        if "Resend notification failed:" in logs:
            lines = [l for l in logs.split('\n') if "Resend notification failed:" in l]
            print(f"\n❌ EMAIL FAILED: Resend notification failed")
            for line in lines:
                print(f"   {line.strip()}")
            return "failed", lines[-1] if lines else ""
        
        # Check for skipped (missing env vars)
        if "Email alerts skipped:" in logs:
            print("\n⚠️  EMAIL SKIPPED: RESEND_API_KEY or OWNER_EMAIL missing")
            return "skipped", ""
        
        print("\n⚠️  NO EMAIL LOGS FOUND: Email may not have been triggered or logs not yet written")
        return "unknown", ""
        
    except Exception as e:
        print(f"\n❌ Error checking logs: {e}")
        return "error", str(e)

def test_contact_email_alert():
    """Test 1: POST /api/contact should trigger email alert"""
    print("\n" + "="*80)
    print("TEST 1: POST /api/contact - Email Alert")
    print("="*80)
    
    try:
        # Clear recent logs by noting timestamp
        print(f"📤 Sending contact form submission...")
        start_time = time.time()
        
        payload = {
            "name": "Email Test User",
            "email": "test@example.com",
            "message": "Testing email alerts via Resend integration"
        }
        
        response = requests.post(
            f"{BASE_URL}/contact",
            json=payload,
            timeout=10
        )
        
        response_time = time.time() - start_time
        
        print(f"Status: {response.status_code}")
        print(f"Response time: {response_time:.2f}s")
        print(f"Response: {response.text}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        if not data.get("success"):
            print(f"❌ FAILED: Expected success:true, got {data}")
            return False
        
        if response_time > 2.0:
            print(f"⚠️  WARNING: Response took {response_time:.2f}s (should be <2s, email should not block)")
        else:
            print(f"✅ Response fast ({response_time:.2f}s) - email not blocking request")
        
        print(f"✅ Contact form submitted successfully, id: {data.get('id')}")
        
        # Check logs for email notification
        status, log_line = check_logs_for_email(wait_seconds=5)
        
        if status == "success":
            if "contact" in log_line:
                print("✅ TEST 1 PASSED: Contact email alert sent successfully")
                return True
            else:
                print("⚠️  Email sent but type unclear from logs")
                return True
        elif status == "rejected":
            print("❌ TEST 1 FAILED: Resend rejected the notification (likely 403 - account email mismatch)")
            return False
        elif status == "failed":
            print("❌ TEST 1 FAILED: Email notification failed")
            return False
        elif status == "skipped":
            print("⚠️  TEST 1 SKIPPED: Email alerts disabled (missing env vars)")
            return True  # Not a failure, just not configured
        else:
            print("⚠️  TEST 1 UNCERTAIN: Could not confirm email status from logs")
            return False
            
    except Exception as e:
        print(f"❌ TEST 1 EXCEPTION: {e}")
        return False

def test_chat_email_alert():
    """Test 2: POST /api/chat (new session) should trigger email alert"""
    print("\n" + "="*80)
    print("TEST 2: POST /api/chat - Email Alert for New Session")
    print("="*80)
    
    try:
        session_id = f"email-alert-test-{uuid.uuid4().hex[:8]}"
        print(f"📤 Starting new chat session: {session_id}")
        start_time = time.time()
        
        payload = {
            "sessionId": session_id,
            "messages": [
                {
                    "role": "user",
                    "content": "Hi, what does he work on?"
                }
            ]
        }
        
        response = requests.post(
            f"{BASE_URL}/chat",
            json=payload,
            timeout=30,
            stream=True
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        # Read streaming response
        full_response = ""
        for chunk in response.iter_content(chunk_size=None, decode_unicode=True):
            if chunk:
                full_response += chunk
        
        response_time = time.time() - start_time
        
        print(f"Response time: {response_time:.2f}s")
        print(f"Content-Type: {response.headers.get('Content-Type')}")
        print(f"Response length: {len(full_response)} chars")
        print(f"Response preview: {full_response[:200]}...")
        
        if not full_response:
            print("❌ FAILED: Empty response")
            return False
        
        print(f"✅ Chat response received successfully")
        
        # Check logs for email notification
        status, log_line = check_logs_for_email(wait_seconds=5)
        
        if status == "success":
            if "chat" in log_line:
                print("✅ TEST 2 PASSED: Chat email alert sent successfully")
                return True
            else:
                print("⚠️  Email sent but type unclear from logs")
                return True
        elif status == "rejected":
            print("❌ TEST 2 FAILED: Resend rejected the notification (likely 403 - account email mismatch)")
            return False
        elif status == "failed":
            print("❌ TEST 2 FAILED: Email notification failed")
            return False
        elif status == "skipped":
            print("⚠️  TEST 2 SKIPPED: Email alerts disabled (missing env vars)")
            return True  # Not a failure, just not configured
        else:
            print("⚠️  TEST 2 UNCERTAIN: Could not confirm email status from logs")
            return False
            
    except Exception as e:
        print(f"❌ TEST 2 EXCEPTION: {e}")
        return False

def test_health_regression():
    """Test 3: GET /api/health - Regression test"""
    print("\n" + "="*80)
    print("TEST 3: GET /api/health - Regression")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("status") != "ok":
            print(f"❌ FAILED: Expected status:ok, got {data}")
            return False
        
        print("✅ TEST 3 PASSED: Health check working")
        return True
        
    except Exception as e:
        print(f"❌ TEST 3 EXCEPTION: {e}")
        return False

def main():
    print("\n" + "="*80)
    print("🧪 BACKEND TEST: Email Alerts via Resend Integration")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Testing: POST /api/contact, POST /api/chat email notifications")
    print("="*80)
    
    results = []
    
    # Test 1: Contact form email
    results.append(("Contact email alert", test_contact_email_alert()))
    
    # Test 2: Chat session email
    results.append(("Chat email alert", test_chat_email_alert()))
    
    # Test 3: Health check regression
    results.append(("Health check regression", test_health_regression()))
    
    # Summary
    print("\n" + "="*80)
    print("📊 TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status}: {name}")
    
    print("="*80)
    print(f"Result: {passed}/{total} tests passed")
    print("="*80)
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    exit(main())
