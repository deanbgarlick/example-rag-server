#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Server URL
SERVER_URL="http://localhost:3000"

# Function to print section headers
print_header() {
    echo -e "\n${BOLD}$1${NC}"
    echo "----------------------------------------"
}

# Function to check if server is running
check_server() {
    if ! curl -s "$SERVER_URL/health" > /dev/null; then
        echo -e "${RED}Error: Server is not running. Please start the server with 'npm run start'${NC}"
        exit 1
    fi
}

# Test health endpoint
test_health() {
    print_header "Testing Health Endpoint"
    response=$(curl -s "$SERVER_URL/health")
    if [[ $response == *"ok"* ]]; then
        echo -e "${GREEN}✓ Health check passed${NC}"
    else
        echo -e "${RED}✗ Health check failed${NC}"
        echo "Response: $response"
    fi
}

# Test document insertion
test_document_insertion() {
    print_header "Testing Document Insertion Endpoint"
    response=$(curl -s -X POST "$SERVER_URL/documents" \
        -H "Content-Type: application/json" \
        -d '{
            "documents": [
                {
                    "pageContent": "MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need.",
                    "metadata": {
                        "source": "test"
                    }
                },
                {
                    "pageContent": "MongoDB Atlas is the multi-cloud developer data platform that accelerates and simplifies building with data.",
                    "metadata": {
                        "source": "test"
                    }
                }
            ]
        }')
    
    if [[ $response == *"success\":true"* ]]; then
        echo -e "${GREEN}✓ Document insertion successful${NC}"
        echo "Response: $response"
    else
        echo -e "${RED}✗ Document insertion failed${NC}"
        echo "Response: $response"
    fi
}

# Test query endpoint
test_query() {
    print_header "Testing Query Endpoint"
    # URL encode the query parameter
    query="What is MongoDB Atlas?"
    encoded_query=$(echo $query | sed 's/ /%20/g')
    
    response=$(curl -s "$SERVER_URL/query?q=$encoded_query")
    
    if [[ $response == *"success\":true"* ]]; then
        echo -e "${GREEN}✓ Query successful${NC}"
        echo "Response: $response"
    else
        echo -e "${RED}✗ Query failed${NC}"
        echo "Response: $response"
    fi
}

# Main test execution
main() {
    print_header "Starting Server Tests"
    
    # Check if server is running
    check_server
    
    # Run tests
    test_health
    test_document_insertion
    sleep 2 # Wait for documents to be processed
    test_query
    
    print_header "Tests Completed"
}

# Run main function
main
