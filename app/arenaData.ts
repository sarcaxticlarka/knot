export interface ArenaNode {
  id: string;
  title: string;
  category: string;
  difficulty: "Apprentice" | "Specialist" | "Grandmaster";
  xpReward: number;
  coordinates: { x: number; y: number };
  prerequisites: string[];
  status: "locked" | "unlocked" | "completed";
  questDetails: {
    problem: string;
    inputSample: string;
    outputSample: string;
    codeTemplate: string;
    pythonTemplate: string;
    testCases: { input: any; expected: any; description: string; hidden?: boolean }[];
    validatorName: string;
  };
}

export const ARENA_NODES: ArenaNode[] = [
  {
    id: "node-1",
    title: "Array Inversion Matrix",
    category: "Arrays & Hashing",
    difficulty: "Apprentice",
    xpReward: 150,
    coordinates: { x: 180, y: 220 },
    prerequisites: [],
    status: "completed",
    questDetails: {
      problem: "Calculate the total number of element inversions in a transmission array. An inversion is a pair of indices (i, j) such that i < j and A[i] > A[j].",
      inputSample: "[2, 4, 1, 3, 5]",
      outputSample: "3",
      codeTemplate: `function countInversions(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) count++;
    }
  }
  return count;
}`,
      pythonTemplate: `def countInversions(arr):
    count = 0
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] > arr[j]:
                count += 1
    return count`,
      testCases: [
        { input: [2, 4, 1, 3, 5], expected: 3, description: "Standard unsorted array" },
        { input: [1, 2, 3, 4, 5], expected: 0, description: "Already sorted array" },
        { input: [5, 4, 3, 2, 1], expected: 10, description: "Reverse sorted array", hidden: true }
      ],
      validatorName: "countInversions"
    }
  },
  {
    id: "node-2",
    title: "Quantum Pointer Search",
    category: "Two Pointers",
    difficulty: "Specialist",
    xpReward: 250,
    coordinates: { x: 450, y: 120 },
    prerequisites: ["node-1"],
    status: "unlocked",
    questDetails: {
      problem: "Search for a target pair in a sorted energy level array that sums up to a target value. Return the 1-based indices of the two elements. Assume exactly one solution exists and do not use the same element twice.",
      inputSample: "energies = [2, 7, 11, 15], target = 9",
      outputSample: "[1, 2]",
      codeTemplate: `function quantumSearch(energies, target) {
  let left = 0;
  let right = energies.length - 1;
  
  while (left < right) {
    let sum = energies[left] + energies[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}`,
      pythonTemplate: `def quantumSearch(energies, target):
    left = 0
    right = len(energies) - 1
    
    while left < right:
        total = energies[left] + energies[right]
        if total == target:
            return [left + 1, right + 1]
        elif total < target:
            left += 1
        else:
            right -= 1
    return []`,
      testCases: [
        { input: { energies: [2, 7, 11, 15], target: 9 }, expected: [1, 2], description: "Target in the beginning" },
        { input: { energies: [1, 3, 4, 6, 8, 10], target: 14 }, expected: [4, 5], description: "Target in middle/end" },
        { input: { energies: [2, 3, 4], target: 6 }, expected: [1, 3], description: "Target spans ends", hidden: true }
      ],
      validatorName: "quantumSearch"
    }
  },
  {
    id: "node-3",
    title: "Sliding Window Nexus",
    category: "Sliding Window",
    difficulty: "Grandmaster",
    xpReward: 400,
    coordinates: { x: 750, y: 120 },
    prerequisites: ["node-2"],
    status: "locked",
    questDetails: {
      problem: "Given a binary array representing connection status packets, and an integer k, return the maximum number of consecutive 1s in the array if you can flip at most k 0s to 1s.",
      inputSample: "packets = [1,1,1,0,0,0,1,1,1,1,0], k = 2",
      outputSample: "6",
      codeTemplate: `function slidingWindowNexus(packets, k) {
  let left = 0;
  let maxLen = 0;
  let zeroCount = 0;
  
  for (let right = 0; right < packets.length; right++) {
    if (packets[right] === 0) zeroCount++;
    
    while (zeroCount > k) {
      if (packets[left] === 0) zeroCount--;
      left++;
    }
    
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
}`,
      pythonTemplate: `def slidingWindowNexus(packets, k):
    left = 0
    max_len = 0
    zero_count = 0
    
    for right in range(len(packets)):
        if packets[right] == 0:
            zero_count += 1
            
        while zero_count > k:
            if packets[left] == 0:
                zero_count -= 1
            left += 1
            
        current_len = right - left + 1
        if current_len > max_len:
            max_len = current_len
            
    return max_len`,
      testCases: [
        { input: { packets: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k: 2 }, expected: 6, description: "Standard sequence" },
        { input: { packets: [0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], k: 3 }, expected: 10, description: "Long array with multiple options" },
        { input: { packets: [1, 1, 1], k: 0 }, expected: 3, description: "No flips permitted, already all ones", hidden: true }
      ],
      validatorName: "slidingWindowNexus"
    }
  },
  {
    id: "node-4",
    title: "Binary Tree Sanctum",
    category: "Trees",
    difficulty: "Specialist",
    xpReward: 350,
    coordinates: { x: 450, y: 380 },
    prerequisites: ["node-2"],
    status: "locked",
    questDetails: {
      problem: "You are given a flat array representing a binary tree in level order (where -1 represents null/empty nodes). Verify if the tree is height-balanced (subtree depths differ by no more than 1).",
      inputSample: "[3, 9, 20, -1, -1, 15, 7]",
      outputSample: "true",
      codeTemplate: `function isTreeBalanced(treeArray) {
  if (treeArray.length === 0) return true;
  
  function checkHeight(idx) {
    if (idx >= treeArray.length || treeArray[idx] === -1) return 0;
    
    let leftHeight = checkHeight(2 * idx + 1);
    if (leftHeight === -1) return -1;
    
    let rightHeight = checkHeight(2 * idx + 2);
    if (rightHeight === -1) return -1;
    
    if (Math.abs(leftHeight - rightHeight) > 1) return -1;
    return Math.max(leftHeight, rightHeight) + 1;
  }
  
  return checkHeight(0) !== -1;
}`,
      pythonTemplate: `def isTreeBalanced(treeArray):
    if len(treeArray) == 0:
        return True
        
    def checkHeight(idx):
        if idx >= len(treeArray) or treeArray[idx] == -1:
            return 0
            
        leftHeight = checkHeight(2 * idx + 1)
        if leftHeight == -1:
            return -1
            
        rightHeight = checkHeight(2 * idx + 2)
        if rightHeight == -1:
            return -1
            
        heightDiff = leftHeight - rightHeight
        if heightDiff < 0:
            heightDiff = -heightDiff
            
        if heightDiff > 1:
            return -1
            
        if leftHeight > rightHeight:
            return leftHeight + 1
        else:
            return rightHeight + 1
            
    return checkHeight(0) != -1`,
      testCases: [
        { input: [3, 9, 20, -1, -1, 15, 7], expected: true, description: "Balanced tree" },
        { input: [1, 2, 2, 3, 3, -1, -1, 4, 4], expected: false, description: "Unbalanced tree with left tilt" },
        { input: [], expected: true, description: "Empty tree", hidden: true }
      ],
      validatorName: "isTreeBalanced"
    }
  },
  {
    id: "node-5",
    title: "Graph Reconnaissance",
    category: "Graphs",
    difficulty: "Grandmaster",
    xpReward: 500,
    coordinates: { x: 750, y: 380 },
    prerequisites: ["node-3"],
    status: "locked",
    questDetails: {
      problem: "Analyze a data routing graph with N nodes and directed transmission channels (edges). Determine if the system contains any cyclic loop feedbacks.",
      inputSample: "n = 4, channels = [[0,1], [1,2], [2,3], [3,1]]",
      outputSample: "true",
      codeTemplate: `function detectCycles(n, channels) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of channels) {
    adj[u].push(v);
  }
  
  const visited = new Array(n).fill(0);
  
  function hasCycleDFS(node) {
    if (visited[node] === 1) return true;
    if (visited[node] === 2) return false;
    
    visited[node] = 1;
    for (const neighbor of adj[node]) {
      if (hasCycleDFS(neighbor)) return true;
    }
    
    visited[node] = 2;
    return false;
  }
  
  for (let i = 0; i < n; i++) {
    if (visited[i] === 0) {
      if (hasCycleDFS(i)) return true;
    }
  }
  return false;
}`,
      pythonTemplate: `def detectCycles(n, channels):
    adj = []
    for i in range(n):
        adj.append([])
    for c in channels:
        adj[c[0]].append(c[1])
        
    visited = []
    for i in range(n):
        visited.append(0)
        
    def hasCycleDFS(node):
        if visited[node] == 1:
            return True
        if visited[node] == 2:
            return False
            
        visited[node] = 1
        for neighbor in adj[node]:
            if hasCycleDFS(neighbor):
                return True
        visited[node] = 2
        return False
        
    for i in range(n):
        if visited[i] == 0:
            if hasCycleDFS(i):
                return True
    return False`,
      testCases: [
        { input: { n: 4, channels: [[0, 1], [1, 2], [2, 3], [3, 1]] }, expected: true, description: "Simple cycle present" },
        { input: { n: 4, channels: [[0, 1], [1, 2], [2, 3]] }, expected: false, description: "Acyclic path" },
        { input: { n: 3, channels: [[0, 1], [0, 2], [1, 2]] }, expected: false, description: "DAG no cycle", hidden: true }
      ],
      validatorName: "detectCycles"
    }
  },
  {
    id: "node-6",
    title: "Dynamic DP Citadel",
    category: "Dynamic Programming",
    difficulty: "Grandmaster",
    xpReward: 750,
    coordinates: { x: 1050, y: 250 },
    prerequisites: ["node-4", "node-5"],
    status: "locked",
    questDetails: {
      problem: "Find a path from top-left (0,0) of a grid matrix to bottom-right (M-1, N-1) that minimizes the total sum of fuel costs. You can only move right or down.",
      inputSample: "grid = [[1,3,1],[1,5,1],[4,2,1]]",
      outputSample: "7",
      codeTemplate: `function minPathFuel(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  
  dp[0][0] = grid[0][0];
  for (let i = 1; i < m; i++) {
    dp[i][0] = dp[i - 1][0] + grid[i][0];
  }
  for (let j = 1; j < n; j++) {
    dp[0][j] = dp[0][j - 1] + grid[0][j];
  }
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }
  return dp[m - 1][n - 1];
}`,
      pythonTemplate: `def minPathFuel(grid):
    m = len(grid)
    n = len(grid[0])
    
    dp = []
    for i in range(m):
        row = []
        for j in range(n):
            row.append(0)
        dp.append(row)
        
    dp[0][0] = grid[0][0]
    
    for i in range(1, m):
        dp[i][0] = dp[i - 1][0] + grid[i][0]
        
    for j in range(1, n):
        dp[0][j] = dp[0][j - 1] + grid[0][j]
        
    for i in range(1, m):
        for j in range(1, n):
            left_val = dp[i - 1][j]
            up_val = dp[i][j - 1]
            min_val = left_val
            if up_val < left_val:
                min_val = up_val
            dp[i][j] = min_val + grid[i][j]
            
    return dp[m - 1][n - 1]`,
      testCases: [
        { input: [[1, 3, 1], [1, 5, 1], [4, 2, 1]], expected: 7, description: "Citadel grid 3x3" },
        { input: [[1, 2, 3], [4, 5, 6]], expected: 12, description: "Grid 2x3", hidden: true }
      ],
      validatorName: "minPathFuel"
    }
  }
];
