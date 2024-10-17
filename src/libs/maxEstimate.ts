import { User } from "../components/Room";

// Function to calculate the most frequent estimate
export function getMostFrequentEstimate(users: User[]): string | null {
  // Step 1: Filter out users with null estimates
  const estimates = users.map((user) => user.estimate).filter((estimate): estimate is string => estimate !== null);

  if (estimates.length === 0) {
    return null; // No estimates to count
  }

  // Step 2: Create a frequency map to count occurrences of each estimate
  const frequencyMap: Record<string, number> = {};

  estimates.forEach((estimate) => {
    frequencyMap[estimate] = (frequencyMap[estimate] || 0) + 1;
  });

  // Step 3: Find the estimate with the highest frequency
  let mostFrequentEstimate: string = estimates[0];
  let maxCount = 0;

  for (const estimate in frequencyMap) {
    if (frequencyMap[estimate] > maxCount) {
      mostFrequentEstimate = estimate;
      maxCount = frequencyMap[estimate];
    }
  }

  return mostFrequentEstimate;
}
