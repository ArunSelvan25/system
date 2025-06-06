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
        Schema::create('property_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., Apartment, Villa, Studio
            $table->tinyInteger('status'); // 0 for inactive, 1 for active
            $table->timestamps();
            $table->softDeletes(); // Soft delete
        });

        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., WiFi, AC, Gym
            $table->tinyInteger('status'); // 0 for inactive, 1 for active
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('property_id')->unique(); // Unique identifier for the property
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->index();

            $table->string('property_name');
            $table->string('property_type');
            $table->text('description')->nullable();
            $table->enum('property_status', ['available', 'rented', 'maintenance'])->default('available');

            // Location
            $table->string('address_line_1');
            $table->string('address_line_2')->nullable();
            $table->string('city')->index();
            $table->string('state')->index();
            $table->string('postal_code');
            $table->string('country')->index();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->tinyInteger('status'); // 0 for inactive, 1 for active

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('amenity_property', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('amenity_id')->constrained()->onDelete('cascade');
            $table->unique(['property_id', 'amenity_id']);
            $table->tinyInteger('status'); // 0 for inactive, 1 for active
            $table->timestamps();
        });

        Schema::create('property_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id')->index();
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
            $table->string('path');
            $table->string('alt_text')->nullable();
            $table->tinyInteger('status'); // 0 for inactive, 1 for active
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('property_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id')->index();
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
            $table->string('document_type')->nullable(); // e.g., Ownership Proof, Floor Plan
            $table->string('path');
            $table->tinyInteger('status'); // 0 for inactive, 1 for active
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('property_financials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id')->index();
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');

            $table->decimal('monthly_rent', 10, 2);
            $table->decimal('security_deposit', 10, 2)->nullable();
            $table->decimal('maintenance_charges', 10, 2)->nullable();
            $table->integer('lease_duration')->nullable();
            $table->integer('rent_due_day')->nullable();
            $table->boolean('is_negotiable')->default(0);
            $table->string('payment_frequency')->default('monthly');
            $table->json('charges')->nullable();
            $table->tinyInteger('status');
            $table->string('currency')->default('INR');

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('property_tenant', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('property_id')->index();
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');

            $table->unsignedBigInteger('user_id')->index();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('property_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id')->index();
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');

             $table->unsignedBigInteger('user_id')->index();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // tenant

            $table->enum('transaction_type', ['rent', 'deposit', 'maintenance', 'penalty', 'other']);
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('INR');
            $table->string('payment_method')->nullable();
            $table->string('reference_id')->nullable();
            $table->date('transaction_date');
            $table->text('notes')->nullable();

            $table->string('invoice_number')->nullable()->unique();
            $table->string('receipt_path')->nullable();

            $table->enum('status', ['pending', 'paid', 'failed', 'refunded'])->default('paid');

            $table->timestamps();
            $table->softDeletes();
        });

        // Schema::create('property_logs', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('property_id')->constrained()->onDelete('cascade')->index();
        //     $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null')->index(); // admin or tenant who performed the action
        //     $table->string('action'); // e.g., created, updated, deleted, assigned_tenant, unassigned_tenant
        //     $table->json('changes')->nullable(); // optional: capture field-level changes
        //     $table->text('remarks')->nullable(); // optional: free text notes
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('property_logs');
        Schema::dropIfExists('property_transactions');
        Schema::dropIfExists('property_tenant');
        Schema::dropIfExists('property_financials');
        Schema::dropIfExists('property_documents');
        Schema::dropIfExists('property_images');
        Schema::dropIfExists('amenity_property');
        Schema::dropIfExists('properties');
        Schema::dropIfExists('amenities');
        Schema::dropIfExists('property_types');
    }
};
