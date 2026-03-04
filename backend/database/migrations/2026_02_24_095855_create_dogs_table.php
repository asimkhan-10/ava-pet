<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dogs', function (Blueprint $table) {
           $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('name');
            $table->string('last_location');
            $table->text('description');
            $table->string('breed')->nullable(); // For personal profiles

            // Map coordinates
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            $table->json('images')->nullable(); // Array of image paths
            $table->enum('status', ['missing', 'nearby', 'owned'])->default('owned');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dogs');
    }
};
