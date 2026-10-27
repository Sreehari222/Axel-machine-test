<?php

namespace App\Http\Controllers;

use App\Enums\LeadStatus;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = session('lead_filters', [
            'search' => '',
            'status' => '',
            'sort' => 'desc',
        ]);

        $leads = Lead::query()
            ->when($filters['search'] ?? '', function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? '', function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy(
                'created_at',
                ($filters['sort'] ?? 'desc') === 'asc' ? 'asc' : 'desc'
            )
            ->paginate(5)
            ->through(fn (Lead $lead) => [
                'id' => $lead->id,
                'name' => $lead->name,
                'email' => $lead->email,
                'phone' => $lead->phone,
                'status' => $lead->status->value,
                'created_at' => $lead->created_at->format('d M Y, h:i A'),
            ]);

        return Inertia::render('Leads/Index', [
            'leads' => $leads,
            'filters' => $filters,
            'statuses' => LeadStatus::values(),
        ]);
    }

    public function filter(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:' . implode(',', LeadStatus::values())],
            'sort' => ['required', 'in:asc,desc'],
        ]);

        session()->put('lead_filters', [
            'search' => $validated['search'] ?? '',
            'status' => $validated['status'] ?? '',
            'sort' => $validated['sort'],
        ]);

        return redirect()->route('leads.index');
    }

    public function resetFilters(): RedirectResponse
    {
        session()->forget('lead_filters');

        return redirect()->route('leads.index');
    }

    public function create(): Response
    {
        return Inertia::render('Leads/Create', [
            'statuses' => LeadStatus::values(),
        ]);
    }

    public function store(StoreLeadRequest $request): RedirectResponse
    {
        Lead::create($request->validated());

        return redirect()
            ->route('leads.index')
            ->with('success', 'Lead created successfully.');
    }

    public function edit(Lead $lead): Response
    {
        return Inertia::render('Leads/Edit', [
            'lead' => [
                'id' => $lead->id,
                'name' => $lead->name,
                'email' => $lead->email,
                'phone' => $lead->phone,
                'status' => $lead->status->value,
            ],
            'statuses' => LeadStatus::values(),
        ]);
    }

    public function update(
        UpdateLeadRequest $request,
        Lead $lead
    ): RedirectResponse {
        $lead->update($request->validated());

        return redirect()
            ->route('leads.index')
            ->with('success', 'Lead updated successfully.');
    }

    public function destroy(Lead $lead): RedirectResponse
    {
        $lead->delete();

        return redirect()
            ->route('leads.index')
            ->with('success', 'Lead deleted successfully.');
    }
}
