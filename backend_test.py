#!/usr/bin/env python3
"""
Backend API Test Suite for Portfolio AI Assistant
Tests the Next.js API routes at /app/app/api/[[...path]]/route.js
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

print(f"🧪 Testing Backend API at: {API_URL}\n")
print("=" * 80)

# Test session ID for all tests
TEST_SESSION_ID = "backend-test-1"

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
# TEST 1: GET /api/health
# ============================================================
print("\n" + "=" * 80)
print("TEST 1: GET /api/health")
print("=" * 80)

try:
    response = requests.get(f"{API_URL}/health", timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        if data.get('status') == 'ok':
            log_test("GET /api/health", True, "Returns 200 with {status:'ok'}")
        else:
            log_test("GET /api/health", False, f"Expected status:'ok', got {data}")
    else:
        log_test("GET /api/health", False, f"Expected 200, got {response.status_code}")
except Exception as e:
    log_test("GET /api/health", False, f"Exception: {str(e)}")

# ============================================================
# TEST 2: POST /api/chat - Streaming response grounded in portfolio
# ============================================================
print("\n" + "=" * 80)
print("TEST 2: POST /api/chat - Streaming AI response")
print("=" * 80)

first_user_message = "What has he built with LLMs?"
first_assistant_response = ""

try:
    payload = {
        "sessionId": TEST_SESSION_ID,
        "messages": [
            {"role": "user", "content": first_user_message}
        ]
    }
    
    print(f"Request: POST {API_URL}/chat")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(
        f"{API_URL}/chat",
        json=payload,
        stream=True,
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type')}")
    
    if response.status_code == 200:
        content_type = response.headers.get('Content-Type', '')
        
        # Check Content-Type is text/plain
        if 'text/plain' not in content_type:
            log_test("POST /api/chat - Content-Type", False, f"Expected text/plain, got {content_type}")
        else:
            print("✓ Content-Type is text/plain")
        
        # Stream and collect response
        print("\nStreaming Response:")
        print("-" * 80)
        for chunk in response.iter_content(chunk_size=None, decode_unicode=True):
            if chunk:
                first_assistant_response += chunk
                print(chunk, end='', flush=True)
        print("\n" + "-" * 80)
        
        # Check if response is grounded (mentions RAGStack or DistilLab)
        response_lower = first_assistant_response.lower()
        is_grounded = ('ragstack' in response_lower or 
                      'distillab' in response_lower or
                      'rag' in response_lower or
                      'distil' in response_lower or
                      'llm' in response_lower)
        
        if is_grounded:
            log_test("POST /api/chat - Grounded response", True, 
                    "Response mentions portfolio projects (RAGStack/DistilLab/LLM work)")
        else:
            log_test("POST /api/chat - Grounded response", False, 
                    "Response does not clearly reference portfolio LLM projects")
        
        log_test("POST /api/chat - Streaming", True, "Successfully streamed plain text response")
    else:
        log_test("POST /api/chat", False, f"Expected 200, got {response.status_code}: {response.text}")
        
except Exception as e:
    log_test("POST /api/chat", False, f"Exception: {str(e)}")

# ============================================================
# TEST 3: Multi-turn conversation with context retention
# ============================================================
print("\n" + "=" * 80)
print("TEST 3: Multi-turn conversation - Context retention")
print("=" * 80)

second_user_message = "What was the latency of that project?"
second_assistant_response = ""

try:
    # Include previous conversation in messages array
    payload = {
        "sessionId": TEST_SESSION_ID,
        "messages": [
            {"role": "user", "content": first_user_message},
            {"role": "assistant", "content": first_assistant_response},
            {"role": "user", "content": second_user_message}
        ]
    }
    
    print(f"Request: POST {API_URL}/chat")
    print(f"Payload: {json.dumps(payload, indent=2)[:500]}...")
    
    response = requests.post(
        f"{API_URL}/chat",
        json=payload,
        stream=True,
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("\nStreaming Response:")
        print("-" * 80)
        for chunk in response.iter_content(chunk_size=None, decode_unicode=True):
            if chunk:
                second_assistant_response += chunk
                print(chunk, end='', flush=True)
        print("\n" + "-" * 80)
        
        # Check if response references latency metrics (800ms for RAGStack)
        response_lower = second_assistant_response.lower()
        has_latency_context = ('800' in response_lower or 
                              'latency' in response_lower or
                              'ms' in response_lower or
                              'p95' in response_lower)
        
        if has_latency_context:
            log_test("Multi-turn conversation", True, 
                    "Response shows context retention (references latency metrics)")
        else:
            log_test("Multi-turn conversation", False, 
                    "Response does not clearly reference latency/metrics from context")
    else:
        log_test("Multi-turn conversation", False, 
                f"Expected 200, got {response.status_code}: {response.text}")
        
except Exception as e:
    log_test("Multi-turn conversation", False, f"Exception: {str(e)}")

# ============================================================
# TEST 4: GET /api/chat/history?sessionId=backend-test-1
# ============================================================
print("\n" + "=" * 80)
print("TEST 4: GET /api/chat/history with sessionId")
print("=" * 80)

try:
    response = requests.get(
        f"{API_URL}/chat/history",
        params={"sessionId": TEST_SESSION_ID},
        timeout=10
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:500]}...")
    
    if response.status_code == 200:
        data = response.json()
        
        # Check structure
        if 'sessionId' in data and 'messages' in data:
            print(f"✓ Response has correct structure")
            print(f"  sessionId: {data['sessionId']}")
            print(f"  messages count: {len(data['messages'])}")
            
            # Should have 4 messages after 2 exchanges (2 user + 2 assistant)
            if len(data['messages']) >= 4:
                log_test("GET /api/chat/history", True, 
                        f"Returns persisted conversation ({len(data['messages'])} messages)")
            else:
                log_test("GET /api/chat/history", False, 
                        f"Expected at least 4 messages, got {len(data['messages'])}")
        else:
            log_test("GET /api/chat/history", False, 
                    f"Missing sessionId or messages in response: {data}")
    else:
        log_test("GET /api/chat/history", False, 
                f"Expected 200, got {response.status_code}: {response.text}")
        
except Exception as e:
    log_test("GET /api/chat/history", False, f"Exception: {str(e)}")

# ============================================================
# TEST 5: GET /api/chat/history without sessionId (should fail)
# ============================================================
print("\n" + "=" * 80)
print("TEST 5: GET /api/chat/history without sessionId (validation)")
print("=" * 80)

try:
    response = requests.get(f"{API_URL}/chat/history", timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 400:
        data = response.json()
        if 'error' in data:
            log_test("GET /api/chat/history without sessionId", True, 
                    "Returns 400 with error message")
        else:
            log_test("GET /api/chat/history without sessionId", False, 
                    "Returns 400 but missing error field")
    else:
        log_test("GET /api/chat/history without sessionId", False, 
                f"Expected 400, got {response.status_code}")
        
except Exception as e:
    log_test("GET /api/chat/history without sessionId", False, f"Exception: {str(e)}")

# ============================================================
# TEST 6: POST /api/chat with empty messages array (should fail)
# ============================================================
print("\n" + "=" * 80)
print("TEST 6: POST /api/chat with empty messages (validation)")
print("=" * 80)

try:
    payload = {
        "sessionId": "test-validation",
        "messages": []
    }
    
    print(f"Request: POST {API_URL}/chat")
    print(f"Payload: {json.dumps(payload)}")
    
    response = requests.post(f"{API_URL}/chat", json=payload, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 400:
        log_test("POST /api/chat with empty messages", True, 
                "Returns 400 for empty messages array")
    else:
        log_test("POST /api/chat with empty messages", False, 
                f"Expected 400, got {response.status_code}")
        
except Exception as e:
    log_test("POST /api/chat with empty messages", False, f"Exception: {str(e)}")

# ============================================================
# TEST 7: POST /api/chat with final message role 'assistant' (should fail)
# ============================================================
print("\n" + "=" * 80)
print("TEST 7: POST /api/chat with final message role 'assistant' (validation)")
print("=" * 80)

try:
    payload = {
        "sessionId": "test-validation-2",
        "messages": [
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hi there"}
        ]
    }
    
    print(f"Request: POST {API_URL}/chat")
    print(f"Payload: {json.dumps(payload)}")
    
    response = requests.post(f"{API_URL}/chat", json=payload, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 400:
        log_test("POST /api/chat with final role 'assistant'", True, 
                "Returns 400 when final message is not from user")
    else:
        log_test("POST /api/chat with final role 'assistant'", False, 
                f"Expected 400, got {response.status_code}")
        
except Exception as e:
    log_test("POST /api/chat with final role 'assistant'", False, f"Exception: {str(e)}")

# ============================================================
# TEST 8: POST /api/unknownpath (should return 404)
# ============================================================
print("\n" + "=" * 80)
print("TEST 8: POST /api/unknownpath (404 handling)")
print("=" * 80)

try:
    response = requests.post(
        f"{API_URL}/unknownpath",
        json={"test": "data"},
        timeout=10
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 404:
        log_test("POST /api/unknownpath", True, "Returns 404 for unknown route")
    else:
        log_test("POST /api/unknownpath", False, 
                f"Expected 404, got {response.status_code}")
        
except Exception as e:
    log_test("POST /api/unknownpath", False, f"Exception: {str(e)}")

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
