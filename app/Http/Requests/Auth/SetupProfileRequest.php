<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SetupProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'university' => ['required', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'academic_year' => ['nullable', 'string', 'max:50'],
            'bio' => ['nullable', 'string', 'max:500'],
            'learning_style' => ['nullable', 'string', 'in:visual,auditory,kinesthetic,reading'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'courses' => ['nullable', 'array'],
            'courses.*' => ['string', 'max:255'],
            'weekly_availability' => ['nullable'],
            'goals' => ['nullable', 'array'],
            'goals.*' => ['string', 'max:255'],
        ];
    }

    /**
     * Custom validation error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama tampilan wajib diisi.',
            'university.required' => 'Universitas / Institusi wajib diisi.',
            'learning_style.in' => 'Gaya belajar tidak valid.',
            'avatar.image' => 'File foto profil harus berupa gambar.',
            'avatar.mimes' => 'Format gambar harus JPG, PNG, atau WEBP.',
            'avatar.max' => 'Ukuran foto profil maksimal 2MB.',
        ];
    }
}
