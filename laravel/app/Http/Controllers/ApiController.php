<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Testimonial;
use App\Models\PackageDetail;
use App\Models\Setting;
use App\Models\ContactRequest;
use App\Models\FAQItem;
use App\Models\BlogPost;

class ApiController extends Controller
{
    // --- TESTIMONIALS ---
    public function getTestimonials()
    {
        return response()->json(Testimonial::orderBy('id', 'desc')->get());
    }

    public function createTestimonial(Request $request)
    {
        $data = $request->validate([
            'client_name' => 'required|string',
            'client_role' => 'nullable|string',
            'rating' => 'nullable|integer',
            'feedback' => 'nullable|string',
            'image_url' => 'nullable|string',
            'video_url' => 'nullable|string',
            'project_name' => 'nullable|string',
            'duration' => 'nullable|string',
        ]);

        $testimonial = Testimonial::create($data);
        return response()->json($testimonial, 201);
    }

    public function updateTestimonial(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update($request->all());
        return response()->json($testimonial);
    }

    public function deleteTestimonial($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();
        return response()->json(['message' => 'Testimonial deleted successfully']);
    }

    // --- PROJECTS ---
    public function getProjects()
    {
        return response()->json(Project::orderBy('id', 'desc')->get());
    }

    public function createProject(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'client' => 'nullable|string',
            'location' => 'nullable|string',
            'budget' => 'nullable|string',
            'completion_date' => 'nullable|string',
            'duration' => 'nullable|string',
            'architecture_style' => 'nullable|string',
            'description' => 'nullable|string',
            'image_urls' => 'nullable|array',
            'video_url' => 'nullable|string',
            'category' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
        ]);

        $project = Project::create($data);
        return response()->json($project, 201);
    }

    public function updateProject(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $project->update($request->all());
        return response()->json($project);
    }

    public function deleteProject($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(['message' => 'Project deleted successfully']);
    }

    // --- PACKAGES ---
    public function getPackages()
    {
        return response()->json(PackageDetail::all());
    }

    public function createPackage(Request $request)
    {
        $package = PackageDetail::create($request->all());
        return response()->json($package, 201);
    }

    public function updatePackage(Request $request, $id)
    {
        $package = PackageDetail::findOrFail($id);
        $package->update($request->all());
        return response()->json($package);
    }

    public function deletePackage($id)
    {
        $package = PackageDetail::findOrFail($id);
        $package->delete();
        return response()->json(['message' => 'Package deleted successfully']);
    }

    // --- SETTINGS ---
    public function getSetting($key)
    {
        $setting = Setting::where('key', $key)->first();
        if (!$setting) {
            return response()->json(['value' => null], 404);
        }
        return response()->json($setting);
    }

    public function saveSetting(Request $request)
    {
        $request->validate([
            'key' => 'required|string',
            'value' => 'nullable|string',
        ]);

        $setting = Setting::updateOrCreate(
            ['key' => $request->key],
            ['value' => $request->value]
        );

        return response()->json($setting);
    }

    // --- CONTACT LEADS ---
    public function submitContact(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'message' => 'required|string',
        ]);

        $contact = ContactRequest::create($data);
        return response()->json(['message' => 'Contact lead submitted successfully', 'lead' => $contact], 201);
    }

    // --- FAQS ---
    public function getFaqs()
    {
        return response()->json(FAQItem::all());
    }

    // --- BLOGS ---
    public function getBlogs()
    {
        return response()->json(BlogPost::orderBy('id', 'desc')->get());
    }
}
