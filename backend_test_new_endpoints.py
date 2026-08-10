#!/usr/bin/env python3
"""
Backend API Test Suite for NEW Endpoints
Tests contact form, admin endpoints, and resume.pdf
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/.env')

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://neural-portfolio-88.preview.emergentagent.com')
API_URL = f"{BASE_URL}/api"

print(f"🧪 Testing NEW Backend Endpoints at: {BASE_URL}\n")
print("=" * 80)

# Track test results
test_results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(name, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {name}")
    if details:
        print(f"   {details}")
    
    test_results["tests"].append({
        "name": name,
        "passed": passed,
        "details": details
    })
    
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1

# ============================================================
# TEST 1: POST /api/contact with valid data
# ============================================================
print("\n" + "=" * 80)
print("TEST 1: POST /api/contact with valid data")
print("=" * 80)

contact_message_id = None

try:
    payload = {
        "name": "Test Recruiter",
        "email": "recruiter@test.com",
        "message": "Interested in interviewing you"
    }
    
    print(f"Request: POST {API_URL}/contact")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(f"{API_URL}/contact", json=payload, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        if data.get('success') and 'id' in data:
            contact_message_id = data['id']
            log_test("POST /api/contact - valid data", True, 
                    f"Returns 200 with success:true and id:{contact_message_id}")
        else:
            log_test("POST /api/contact - valid data", False, 
                    f"Expected {{success:true, id:<uuid>}}, got {data}")
    else:
        log_test("POST /api/contact - valid data", False, 
                f"Expected 200, got {response.status_code}: {response.text}")
        
except Exception as e:
    log_test("POST /api/contact - valid data", False, f"Exception: {str(e)}")

# ============================================================
# TEST 2: POST /api/contact with missing fields
# ============================================================
print("\n" + "=" * 80)
print("TEST 2: POST /api/contact with missing message field")
print("=" * 80)

try:
    payload = {
        "name": "Test User",
        "email": "test@example.com"
        # missing "message" field
    }
    
    print(f"Request: POST {API_URL}/contact")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(f"{API_URL}/contact", json=payload, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 400:
        log_test("POST /api/contact - missing fields", True, 
                "Returns 400 for missing message field")
    else:
        log_test("POST /api/contact - missing fields", False, 
                f"Expected 400, got {response.status_code}")
        
except Exception as e:
    log_test("POST /api/contact - missing fields", False, f"Exception: {str(e)}")

# ============================================================
# TEST 3: POST /api/contact with invalid email
# ============================================================
print("\n" + "=" * 80)
print("TEST 3: POST /api/contact with invalid email")
print("=" * 80)

try:
    payload = {
        "name": "Test User",
        "email": "not-an-email",
        "message": "This should fail validation"
    }
    
    print(f"Request: POST {API_URL}/contact")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(f"{API_URL}/contact", json=payload, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 400:
        log_test("POST /api/contact - invalid email", True, 
                "Returns 400 for invalid email format")
    else:
        log_test("POST /api/contact - invalid email", False, 
                f"Expected 400, got {response.status_code}")
        
except Exception as e:
    log_test("POST /api/contact - invalid email", False, f"Exception: {str(e)}")

# ============================================================
# TEST 4: POST /api/admin/verify with correct passcode
# ============================================================
print("\n" + "=" * 80)
print("TEST 4: POST /api/admin/verify with correct passcode")
print("=" * 80)

try:
    payload = {
        "passcode": "admin123"
    }
    
    print(f"Request: POST {API_URL}/admin/verify")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(f"{API_URL}/admin/verify", json=payload, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        if data.get('success'):
            log_test("POST /api/admin/verify - correct passcode", True, 
                    "Returns 200 with {success:true}")
        else:
            log_test("POST /api/admin/verify - correct passcode", False, 
                    f"Expected {{success:true}}, got {data}")
    else:
        log_test("POST /api/admin/verify - correct passcode", False, 
                f"Expected 200, got {response.status_code}: {response.text}")
        
except Exception as e:
    log_test("POST /api/admin/verify - correct passcode", False, f"Exception: {str(e)}")

# ============================================================
# TEST 5: POST /api/admin/verify with wrong passcode
# ============================================================
print("\n" + "=" * 80)
print("TEST 5: POST /api/admin/verify with wrong passcode")
print("=" * 80)

try:
    payload = {
        "passcode": "wrong"
    }
    
    print(f"Request: POST {API_URL}/admin/verify")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(f"{API_URL}/admin/verify", json=payload, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 401:
        log_test("POST /api/admin/verify - wrong passcode", True, 
                "Returns 401 for incorrect passcode")
    else:
        log_test("POST /api/admin/verify - wrong passcode", False, 
                f"Expected 401, got {response.status_code}")
        
except Exception as e:
    log_test("POST /api/admin/verify - wrong passcode", False, f"Exception: {str(e)}")

# ============================================================
# TEST 6: GET /api/admin/analytics with correct x-admin-key header
# ============================================================
print("\n" + "=" * 80)
print("TEST 6: GET /api/admin/analytics with x-admin-key header")
print("=" * 80)

try:
    headers = {
        "x-admin-key": "admin123"
    }
    
    print(f"Request: GET {API_URL}/admin/analytics")
    print(f"Headers: {json.dumps(headers, indent=2)}")
    
    response = requests.get(f"{API_URL}/admin/analytics", headers=headers, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:500]}...")
    
    if response.status_code == 200:
        data = response.json()
        required_fields = ['totalSessions', 'totalMessages', 'totalQuestions', 'recentQuestions', 'sessions']
        
        missing_fields = [field for field in required_fields if field not in data]
        
        if not missing_fields:
            print(f"✓ All required fields present")
            print(f"  totalSessions: {data['totalSessions']}")
            print(f"  totalMessages: {data['totalMessages']}")
            print(f"  totalQuestions: {data['totalQuestions']}")
            print(f"  recentQuestions count: {len(data['recentQuestions'])}")
            print(f"  sessions count: {len(data['sessions'])}")
            
            # Check if there's data from earlier chat tests
            if data['totalSessions'] > 0 and data['totalMessages'] > 0:
                log_test("GET /api/admin/analytics - with header", True, 
                        f"Returns 200 with analytics data ({data['totalSessions']} sessions, {data['totalMessages']} messages)")
            else:
                log_test("GET /api/admin/analytics - with header", True, 
                        "Returns 200 with correct structure (no chat data yet)")
        else:
            log_test("GET /api/admin/analytics - with header", False, 
                    f"Missing required fields: {missing_fields}")
    else:
        log_test("GET /api/admin/analytics - with header", False, 
                f"Expected 200, got {response.status_code}: {response.text}")
        
except Exception as e:
    log_test("GET /api/admin/analytics - with header", False, f"Exception: {str(e)}")

# ============================================================
# TEST 7: GET /api/admin/analytics without x-admin-key header
# ============================================================
print("\n" + "=" * 80)
print("TEST 7: GET /api/admin/analytics without x-admin-key header")
print("=" * 80)

try:
    print(f"Request: GET {API_URL}/admin/analytics")
    print("Headers: (none)")
    
    response = requests.get(f"{API_URL}/admin/analytics", timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 401:
        log_test("GET /api/admin/analytics - no header", True, 
                "Returns 401 without x-admin-key header")
    else:
        log_test("GET /api/admin/analytics - no header", False, 
                f"Expected 401, got {response.status_code}")
        
except Exception as e:
    log_test("GET /api/admin/analytics - no header", False, f"Exception: {str(e)}")

# ============================================================
# TEST 8: GET /api/admin/analytics with wrong x-admin-key
# ============================================================
print("\n" + "=" * 80)
print("TEST 8: GET /api/admin/analytics with wrong x-admin-key")
print("=" * 80)

try:
    headers = {
        "x-admin-key": "wrongkey"
    }
    
    print(f"Request: GET {API_URL}/admin/analytics")
    print(f"Headers: {json.dumps(headers, indent=2)}")
    
    response = requests.get(f"{API_URL}/admin/analytics", headers=headers, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 401:
        log_test("GET /api/admin/analytics - wrong key", True, 
                "Returns 401 with incorrect x-admin-key")
    else:
        log_test("GET /api/admin/analytics - wrong key", False, 
                f"Expected 401, got {response.status_code}")
        
except Exception as e:
    log_test("GET /api/admin/analytics - wrong key", False, f"Exception: {str(e)}")

# ============================================================
# TEST 9: GET /api/admin/messages with x-admin-key header
# ============================================================
print("\n" + "=" * 80)
print("TEST 9: GET /api/admin/messages with x-admin-key header")
print("=" * 80)

try:
    headers = {
        "x-admin-key": "admin123"
    }
    
    print(f"Request: GET {API_URL}/admin/messages")
    print(f"Headers: {json.dumps(headers, indent=2)}")
    
    response = requests.get(f"{API_URL}/admin/messages", headers=headers, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:500]}...")
    
    if response.status_code == 200:
        data = response.json()
        
        if 'messages' in data:
            print(f"✓ Response has 'messages' field")
            print(f"  messages count: {len(data['messages'])}")
            
            # Check if our test message from TEST 1 is present
            if contact_message_id and len(data['messages']) > 0:
                # Messages should be newest first
                found_test_message = False
                for msg in data['messages']:
                    if msg.get('id') == contact_message_id:
                        found_test_message = True
                        print(f"✓ Found test message from TEST 1")
                        break
                
                if found_test_message:
                    log_test("GET /api/admin/messages - with header", True, 
                            f"Returns 200 with messages array containing test message (total: {len(data['messages'])})")
                else:
                    log_test("GET /api/admin/messages - with header", True, 
                            f"Returns 200 with messages array ({len(data['messages'])} messages, test message may not be first)")
            else:
                log_test("GET /api/admin/messages - with header", True, 
                        f"Returns 200 with messages array ({len(data['messages'])} messages)")
        else:
            log_test("GET /api/admin/messages - with header", False, 
                    f"Missing 'messages' field in response: {data}")
    else:
        log_test("GET /api/admin/messages - with header", False, 
                f"Expected 200, got {response.status_code}: {response.text}")
        
except Exception as e:
    log_test("GET /api/admin/messages - with header", False, f"Exception: {str(e)}")

# ============================================================
# TEST 10: GET /api/admin/messages without x-admin-key header
# ============================================================
print("\n" + "=" * 80)
print("TEST 10: GET /api/admin/messages without x-admin-key header")
print("=" * 80)

try:
    print(f"Request: GET {API_URL}/admin/messages")
    print("Headers: (none)")
    
    response = requests.get(f"{API_URL}/admin/messages", timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 401:
        log_test("GET /api/admin/messages - no header", True, 
                "Returns 401 without x-admin-key header")
    else:
        log_test("GET /api/admin/messages - no header", False, 
                f"Expected 401, got {response.status_code}")
        
except Exception as e:
    log_test("GET /api/admin/messages - no header", False, f"Exception: {str(e)}")

# ============================================================
# TEST 11: GET /resume.pdf
# ============================================================
print("\n" + "=" * 80)
print("TEST 11: GET /resume.pdf")
print("=" * 80)

try:
    resume_url = f"{BASE_URL}/resume.pdf"
    
    print(f"Request: GET {resume_url}")
    
    response = requests.get(resume_url, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type')}")
    print(f"Content-Length: {len(response.content)} bytes")
    
    if response.status_code == 200:
        content_type = response.headers.get('Content-Type', '')
        
        if 'application/pdf' in content_type:
            # Check if content looks like a PDF (starts with %PDF)
            if response.content[:4] == b'%PDF':
                log_test("GET /resume.pdf", True, 
                        f"Returns 200 with Content-Type: application/pdf ({len(response.content)} bytes)")
            else:
                log_test("GET /resume.pdf", False, 
                        "Content-Type is application/pdf but content doesn't start with %PDF")
        else:
            log_test("GET /resume.pdf", False, 
                    f"Expected Content-Type: application/pdf, got {content_type}")
    else:
        log_test("GET /resume.pdf", False, 
                f"Expected 200, got {response.status_code}")
        
except Exception as e:
    log_test("GET /resume.pdf", False, f"Exception: {str(e)}")

# ============================================================
# SUMMARY
# ============================================================
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)

print(f"\n✅ Passed: {test_results['passed']}")
print(f"❌ Failed: {test_results['failed']}")
print(f"📊 Total:  {test_results['passed'] + test_results['failed']}")

print("\nDetailed Results:")
for test in test_results['tests']:
    status = "✅" if test['passed'] else "❌"
    print(f"{status} {test['name']}")
    if test['details']:
        print(f"   {test['details']}")

# Exit with appropriate code
sys.exit(0 if test_results['failed'] == 0 else 1)
