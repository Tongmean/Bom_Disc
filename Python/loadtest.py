import requests
import time
import concurrent.futures
import psutil
import matplotlib.pyplot as plt
import numpy as np

# Configuration
URL = "http://192.168.5.92:3031/api/display/home"
TEST_DURATION = 100  # Run the test for 30 seconds
CONCURRENT_USERS = 1000  # Number of concurrent users

# Lists to store resource usage and throughput over time
cpu_usage_list = []
memory_usage_list = []
throughput_list = []

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJRY0Bjb21wYWN0LmNvbSIsImlhdCI6MTc0MDAxNjI3OSwiZXhwIjoxNzQwMDUyMjc5fQ.o0M3Z_KZJIIiFNhEsw0mUrmhCyD-dqMG76fsSUrkdj0"  # Replace with your actual token

def make_request():
    """Makes a single request with authentication and measures response time."""
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }
    
    start_time = time.time()
    try:
        response = requests.get(URL, headers=headers, timeout=5)  # 5 sec timeout
        response.raise_for_status()  # Raise error for bad status codes
    except requests.RequestException:
        return None  # Mark failed requests
    return time.time() - start_time


def get_resource_usage():
    """Returns combined CPU & memory usage of Node.js and PostgreSQL in MB and relative to total system CPU usage."""
    node_cpu, node_mem, pg_cpu, pg_mem = 0, 0, 0, 0

    # Get total number of CPU cores
    total_cpu_cores = psutil.cpu_count()

    # Initialize total memory (in MB)
    total_mem_mb = 0

    for process in psutil.process_iter(attrs=['pid', 'name', 'cpu_percent', 'memory_info']):
        name = process.info['name'].lower()
        if "node" in name:
            node_cpu += process.info['cpu_percent']
            node_mem += process.info['memory_info'].rss  # RSS is in bytes
        elif "postgres" in name:
            pg_cpu += process.info['cpu_percent']
            pg_mem += process.info['memory_info'].rss  # RSS is in bytes
    
    total_cpu = node_cpu + pg_cpu
    total_mem_bytes = node_mem + pg_mem

    # Convert memory usage from bytes to MB
    total_mem_mb = total_mem_bytes / (1024 * 1024)

    # Calculate CPU usage as a percentage of total system CPU
    system_cpu_usage = psutil.cpu_percent(interval=1)  # Get system-wide CPU usage
    total_cpu_percent = (total_cpu / (total_cpu_cores * system_cpu_usage)) * 100 if system_cpu_usage else 0

    cpu_usage_list.append(total_cpu_percent)
    memory_usage_list.append(total_mem_mb)

    return total_cpu_percent, total_mem_mb


# Run requests concurrently & measure resource usage
response_times = []
start_time = time.time()
completed_requests = 0

with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENT_USERS) as executor:
    future_requests = []

    while time.time() - start_time < TEST_DURATION:
        future = executor.submit(make_request)
        future_requests.append(future)

        # Monitor resource usage every few requests
        if completed_requests % 10 == 0:
            get_resource_usage()

        completed_requests += 1

    # Collect responses
    for future in concurrent.futures.as_completed(future_requests):
        result = future.result()
        if result is not None:
            response_times.append(result)

# Metrics calculations
total_test_time = time.time() - start_time

if response_times:
    peak_load = max(response_times)
    avg_throughput = len(response_times) / total_test_time
    p90 = np.percentile(response_times, 90)
    p95 = np.percentile(response_times, 95)
else:
    peak_load, avg_throughput, p90, p95 = None, None, None, None

cpu_avg = np.mean(cpu_usage_list) if cpu_usage_list else 0
mem_avg = np.mean(memory_usage_list) if memory_usage_list else 0

# Display results
print(f"Total Requests Sent: {len(response_times)}")
print(f"Peak Response Time: {peak_load:.3f} sec" if peak_load else "No successful requests.")
print(f"Avg Throughput: {avg_throughput:.2f} requests/sec" if avg_throughput else "No successful requests.")
print(f"P90 Response Time: {p90:.3f} sec" if p90 else "No successful requests.")
print(f"P95 Response Time: {p95:.3f} sec" if p95 else "No successful requests.")
print(f"Average CPU Usage (Node.js + PostgreSQL): {cpu_avg:.2f}%")
print(f"Average Memory Usage (Node.js + PostgreSQL): {mem_avg:.2f}MB")

# Plot results
plt.figure(figsize=(12, 10))

plt.subplot(2, 2, 1)
plt.plot(response_times, label="Response Time (s)", color='blue')
if p90: plt.axhline(p90, color='r', linestyle='dashed', label="P90")
if p95: plt.axhline(p95, color='g', linestyle='dashed', label="P95")
plt.xlabel("Request Number")
plt.ylabel("Response Time (s)")
plt.title("Load Testing: Response Times")
plt.legend()

plt.subplot(2, 2, 2)
plt.plot(cpu_usage_list, label="CPU Usage (%)", color='red')
plt.xlabel("Time (requests monitored)")
plt.ylabel("CPU Usage (%)")
plt.title("CPU Usage (Node.js + PostgreSQL)")
plt.legend()

plt.subplot(2, 2, 3)
plt.plot(memory_usage_list, label="Memory Usage (%)", color='green')
plt.xlabel("Time (requests monitored)")
plt.ylabel("Memory Usage (%)")
plt.title("Memory Usage (Node.js + PostgreSQL)")
plt.legend()

plt.subplot(2, 2, 4)
plt.plot(range(len(response_times)), np.cumsum(response_times) / np.arange(1, len(response_times) + 1),
label="Avg Response Time (s)", color='purple')
plt.xlabel("Request Number")
plt.ylabel("Avg Response Time (s)")
plt.title("Response Time Trend")
plt.legend()

plt.tight_layout()
plt.show()
