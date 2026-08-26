<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class StoreThreadRequest extends FormRequest
{
    /**
     * Tentukan apakah user memiliki izin untuk melakukan request ini.
     */
    public function authorize(): bool
    {
        return true; // Set true agar request diizinkan
    }

    /**
     * Dapatkan aturan validasi yang berlaku untuk request.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:5', 'max:255'],
            'channel' => ['required', 'string', 'max:100'],
            'body' => ['required', 'string', 'min:10', 'max:5000'],
        ];
    }

    /**
     * Pesan kustom jika validasi gagal (Bonus Clean Code!).
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul thread wajib diisi.',
            'title.min' => 'Judul thread minimal 5 karakter.',
            'channel.required' => 'Saluran wajib dipilih.',
            'body.required' => 'Isi thread tidak boleh kosong.',
            'body.min' => 'Isi thread minimal 10 karakter.',
        ];
    }
}
