<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'title' => 'Dog Park Meetup',
                'description' => 'Join us for a fun afternoon at the local dog park! A great chance for your pups to socialize.',
                'location' => 'Central Park Dog Run, NY',
                'time' => Carbon::now()->addDays(2)->format('H:i:s'),
                'interested_count' => 15,
                'coming_count' => 8,
                'not_coming_count' => 2,
                'image_path' => 'event1.jpg',
            ],
            [
                'title' => 'Annual Dog Show',
                'description' => 'A showcase of various dog breeds and their skills. Open to all spectators.',
                'location' => 'Convention Center, LA',
                'time' => Carbon::now()->addDays(10)->format('H:i:s'),
                'interested_count' => 120,
                'coming_count' => 50,
                'not_coming_count' => 5,
                'image_path' => 'event2.jpg',
            ],
            [
                'title' => 'Puppy Training Basics',
                'description' => 'A free introductory training session for new puppy owners.',
                'location' => 'Community Center, Austin TX',
                'time' => Carbon::now()->addDays(5)->format('H:i:s'),
                'interested_count' => 45,
                'coming_count' => 20,
                'not_coming_count' => 1,
                'image_path' => 'event3.jpg',
            ],
            [
                'title' => 'Charity Dog Walk',
                'description' => 'Walking 5 miles to raise funds for the local animal shelter. Bring your dogs!',
                'location' => 'Lake Trail, Seattle WA',
                'time' => Carbon::now()->addDays(15)->format('H:i:s'),
                'interested_count' => 200,
                'coming_count' => 80,
                'not_coming_count' => 10,
                'image_path' => 'event4.jpg',
            ],
            [
                'title' => 'Pet Adopt-a-thon',
                'description' => 'Looking to add a furry friend to your family? Come meet our wonderful rescue dogs.',
                'location' => 'Downtown Square, Chicago IL',
                'time' => Carbon::now()->addDays(7)->format('H:i:s'),
                'interested_count' => 300,
                'coming_count' => 150,
                'not_coming_count' => 15,
                'image_path' => 'event5.jpg',
            ]
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
