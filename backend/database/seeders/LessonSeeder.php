<?php

namespace Database\Seeders;

use App\Models\Lesson;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LessonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lessons = [
            // Module 1: Introduction to Blockchain (Beginner)
            [
                'module_id' => 1,
                'title' => 'What is Blockchain?',
                'slug' => 'what-is-blockchain',
                'description' => 'Learn the fundamental concepts of blockchain technology and how it works.',
                'type' => 'video',
                'duration' => '12:30',
                'order' => 1,
                'video_url' => 'https://www.youtube.com/embed/SSo_EIwHSd4',
                'is_published' => true,
                'is_free' => true, // First lesson free
            ],
            [
                'module_id' => 1,
                'title' => 'History of Blockchain & Bitcoin',
                'slug' => 'history-of-blockchain-bitcoin',
                'description' => 'Explore the origins of blockchain technology and the creation of Bitcoin.',
                'type' => 'video',
                'duration' => '15:45',
                'order' => 2,
                'video_url' => 'https://www.youtube.com/embed/qOVAbKKSH10',
                'is_published' => true,
                'is_free' => false,
            ],
            [
                'module_id' => 1,
                'title' => 'How Blockchain Works',
                'slug' => 'how-blockchain-works',
                'description' => 'Deep dive into the technical mechanics of how blockchain operates.',
                'type' => 'video',
                'duration' => '18:20',
                'order' => 3,
                'video_url' => 'https://www.youtube.com/embed/SSo_EIwHSd4',
                'is_published' => true,
                'is_free' => false,
            ],
            [
                'module_id' => 1,
                'title' => 'Blockchain Use Cases',
                'slug' => 'blockchain-use-cases',
                'description' => 'Discover real-world applications of blockchain beyond cryptocurrency.',
                'type' => 'video',
                'duration' => '14:10',
                'order' => 4,
                'video_url' => 'https://www.youtube.com/embed/SSo_EIwHSd4',
                'is_published' => true,
                'is_free' => false,
            ],

            // Module 2: Smart Contracts Deep Dive (Intermediate)
            [
                'module_id' => 2,
                'title' => 'Introduction to Smart Contracts',
                'slug' => 'introduction-to-smart-contracts',
                'description' => 'Understand what smart contracts are and how they revolutionize agreements.',
                'type' => 'video',
                'duration' => '16:30',
                'order' => 1,
                'video_url' => 'https://www.youtube.com/embed/ZE2HxTmxfrI',
                'is_published' => true,
                'is_free' => true, // First lesson free
            ],
            [
                'module_id' => 2,
                'title' => 'Ethereum Virtual Machine (EVM)',
                'slug' => 'ethereum-virtual-machine',
                'description' => 'Learn about the Ethereum Virtual Machine and how it executes smart contracts.',
                'type' => 'video',
                'duration' => '22:15',
                'order' => 2,
                'video_url' => 'https://www.youtube.com/embed/ZE2HxTmxfrI',
                'is_published' => true,
                'is_free' => false,
            ],
            [
                'module_id' => 2,
                'title' => 'Writing Your First Smart Contract',
                'slug' => 'writing-first-smart-contract',
                'description' => 'Hands-on tutorial for creating a basic smart contract in Solidity.',
                'type' => 'interactive',
                'duration' => '35:40',
                'order' => 3,
                'content' => 'Interactive coding environment will be available here.',
                'is_published' => true,
                'is_free' => false,
            ],
            [
                'module_id' => 2,
                'title' => 'Smart Contract Security',
                'slug' => 'smart-contract-security',
                'description' => 'Critical security considerations when developing smart contracts.',
                'type' => 'video',
                'duration' => '28:50',
                'order' => 4,
                'video_url' => 'https://www.youtube.com/embed/ZE2HxTmxfrI',
                'is_published' => true,
                'is_free' => false,
            ],

            // Module 3: DeFi Protocol Analysis (Advanced)
            [
                'module_id' => 3,
                'title' => 'Introduction to DeFi',
                'slug' => 'introduction-to-defi',
                'description' => 'Overview of Decentralized Finance and its core principles.',
                'type' => 'pdf',
                'duration' => '25:00',
                'order' => 1,
                'pdf_url' => 'https://example.com/defi-introduction.pdf',
                'is_published' => true,
                'is_free' => true, // First lesson free
            ],
            [
                'module_id' => 3,
                'title' => 'Automated Market Makers (AMM)',
                'slug' => 'automated-market-makers',
                'description' => 'Deep analysis of AMM protocols like Uniswap and Curve.',
                'type' => 'pdf',
                'duration' => '30:00',
                'order' => 2,
                'pdf_url' => 'https://example.com/amm-analysis.pdf',
                'is_published' => true,
                'is_free' => false,
            ],
            [
                'module_id' => 3,
                'title' => 'Lending Protocols',
                'slug' => 'lending-protocols',
                'description' => 'Study of lending platforms like Aave and Compound.',
                'type' => 'pdf',
                'duration' => '28:00',
                'order' => 3,
                'pdf_url' => 'https://example.com/lending-protocols.pdf',
                'is_published' => true,
                'is_free' => false,
            ],
        ];

        // Insert all lessons
        foreach ($lessons as $lesson) {
            Lesson::create($lesson);
        }
    }
}
