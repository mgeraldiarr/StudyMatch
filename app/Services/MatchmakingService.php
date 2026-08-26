<?php

namespace App\Services;

use App\Models\MatchRequest;
use App\Models\User;
use Illuminate\Support\Collection;

class MatchmakingService
{
    /**
     * Get candidate matches for a given user with calculated compatibility scores.
     *
     * @param User $currentUser
     * @return Collection
     */
    public function getMatchesForUser(User $currentUser): Collection
    {
        $currentUser->loadMissing('courses');
        $userCourseIds = $currentUser->courses->pluck('id')->toArray();
        $userLearningStyle = $currentUser->learning_style;
        $userUniversity = $currentUser->university;
        $userMajor = $currentUser->major;

        $candidates = User::where('id', '!=', $currentUser->id)
            ->where('is_profile_completed', true)
            ->with('courses')
            ->get();

        // Fetch existing match requests involving the current user
        $sentRequests = MatchRequest::where('sender_id', $currentUser->id)->pluck('status', 'receiver_id');
        $receivedRequests = MatchRequest::where('receiver_id', $currentUser->id)->pluck('status', 'sender_id');

        $matchedCandidates = $candidates->map(function (User $candidate) use ($userCourseIds, $userLearningStyle, $userUniversity, $userMajor, $sentRequests, $receivedRequests) {
            $candidateCourseIds = $candidate->courses->pluck('id')->toArray();
            
            // 1. Calculate Course Overlap (Max 40 points)
            $sharedCourseIds = array_intersect($userCourseIds, $candidateCourseIds);
            $sharedCount = count($sharedCourseIds);
            $totalUniqueCourses = max(1, count(array_unique(array_merge($userCourseIds, $candidateCourseIds))));
            $courseScore = ($sharedCount > 0) 
                ? min(40, round(($sharedCount / min(3, $totalUniqueCourses)) * 40))
                : 15; // baseline interest

            // 2. Learning Style Compatibility (Max 30 points)
            $styleScore = 15;
            if (!empty($userLearningStyle) && !empty($candidate->learning_style)) {
                if ($userLearningStyle === $candidate->learning_style) {
                    $styleScore = 30; // Perfect match
                } elseif (
                    ($userLearningStyle === 'visual' && $candidate->learning_style === 'reading') ||
                    ($userLearningStyle === 'auditory' && $candidate->learning_style === 'kinesthetic') ||
                    ($userLearningStyle === 'reading' && $candidate->learning_style === 'visual') ||
                    ($userLearningStyle === 'kinesthetic' && $candidate->learning_style === 'auditory')
                ) {
                    $styleScore = 24; // Complementary styles
                } else {
                    $styleScore = 18;
                }
            }

            // 3. University & Major Alignment (Max 15 points)
            $academicScore = 5;
            if (!empty($userUniversity) && !empty($candidate->university) && strcasecmp($userUniversity, $candidate->university) === 0) {
                $academicScore += 6;
            }
            if (!empty($userMajor) && !empty($candidate->major) && strcasecmp($userMajor, $candidate->major) === 0) {
                $academicScore += 4;
            }

            // 4. Base & Availability Factor (Max 15 points)
            $availabilityScore = 10;
            if (!empty($candidate->weekly_availability)) {
                $availabilityScore = 13;
            }

            // Total Score capped between 65% and 98%
            $rawTotal = $courseScore + $styleScore + $academicScore + $availabilityScore;
            $compatibilityScore = max(65, min(98, $rawTotal));

            // Format shared or candidate courses for display
            $displayCourses = $candidate->courses->pluck('name')->toArray();
            if (empty($displayCourses)) {
                $displayCourses = ['Dasar Pemrograman', 'Matematika'];
            }

            $styleLabel = match ($candidate->learning_style) {
                'visual' => 'Visual',
                'auditory' => 'Diskusi',
                'kinesthetic' => 'Praktik',
                'reading' => 'Membaca',
                default => 'Visual',
            };

            // Determine match status
            $matchStatus = 'none';
            if (isset($sentRequests[$candidate->id])) {
                $matchStatus = $sentRequests[$candidate->id] === 'accepted' ? 'accepted' : 'pending_sent';
            } elseif (isset($receivedRequests[$candidate->id])) {
                $matchStatus = $receivedRequests[$candidate->id] === 'accepted' ? 'accepted' : 'pending_received';
            }

            return [
                'id' => $candidate->id,
                'name' => $candidate->name,
                'email' => $candidate->email,
                'uni' => ($candidate->university ?: 'Universitas Indonesia') . ' · ' . ($candidate->academic_year ?: 'Tahun 3'),
                'university' => $candidate->university ?: 'Universitas Indonesia',
                'major' => $candidate->major ?: 'Teknik Informatika',
                'academic_year' => $candidate->academic_year ?: 'Tahun 3',
                'compat' => (int) $compatibilityScore,
                'style' => $styleLabel,
                'style_raw' => $candidate->learning_style ?: 'visual',
                'online' => (bool) $candidate->is_online,
                'fav' => false,
                'match_status' => $matchStatus,
                'bio' => $candidate->bio ?: 'Siap belajar dan berbagi pemahaman materi perkuliahan bersama.',
                'goals' => $candidate->goals ?? ['Persiapan ujian', 'Diskusi materi'],
                'courses' => $displayCourses,
                'avatar' => $candidate->avatar ?: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28',
            ];
        });

        return $matchedCandidates->sortByDesc('compat')->values();
    }

    /**
     * Get discovery statistics for the current user.
     *
     * @param Collection $matches
     * @return array
     */
    public function getMatchStats(Collection $matches): array
    {
        $highestAccuracy = $matches->max('compat') ?? 94;

        return [
            'total_candidates' => $matches->count(),
            'saved_count' => 0,
            'highest_accuracy' => $highestAccuracy . '%',
        ];
    }
}
