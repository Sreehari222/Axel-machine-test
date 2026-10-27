<?php

namespace App\Http\Requests;

use App\Enums\LeadStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $lead = $this->route('lead');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('leads', 'email')->ignore($lead),
            ],
            'phone' => ['required', 'string', 'max:30'],
            'status' => ['required', Rule::enum(LeadStatus::class)],
        ];
    }
}
