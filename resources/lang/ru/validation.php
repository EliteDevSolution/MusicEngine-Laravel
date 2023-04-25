<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'The :attribute должен быть принят.',
    'active_url' => 'The :attribute не является допустимым URL.',
    'after' => 'The :attribute должен быть датой после :date.',
    'after_or_equal' => 'The :attribute должен быть датой после или равной :date.',
    'alpha' => 'The :attribute может содержать только буквы.',
    'alpha_dash' => 'The :attribute может содержать только буквы, цифры, дефисы и символы подчеркивания.',
    'alpha_num' => 'The :attribute может содержать только буквы и цифры.',
    'array' => 'The :attribute должен быть массивом.',
    'before' => 'The :attribute должен быть датой до :date.',
    'before_or_equal' => 'The :attribute : должен быть датой, предшествующей :date или равной ей :date.',
    'between' => [
        'numeric' => 'The :attribute должен быть между :min and :max.',
        'file' => 'The :attribute должен быть между :min and :max kilobytes.',
        'string' => 'The :attribute должен быть между :min and :max characters.',
        'array' => 'The :attribute должен иметь между :min and :max items.',
    ],
    'boolean' => 'The :attribute Атрибут должно быть истинным или ложным.',
    'confirmed' => 'The :подтверждение Атрибут не совпадает.',
    'date' => 'The :attribute не является допустимой датой.',
    'date_equals' => 'The :attribute должен быть датой, равной :date.',
    'date_format' => 'The :attribute не соответствует формату :format.',
    'different' => 'The :attribute и :other должны быть разными.',
    'digits' => 'The :attribute должен быть :digits digits.',
    'digits_between' => 'The :attribute должен быть между :min and :max digits.',
    'dimensions' => 'The :attribute имеет недопустимые размеры изображения.',
    'distinct' => 'The :attribute Атрибут имеет повторяющееся значение.',
    'email' => 'The :attribute должен быть действительным адресом электронной почты.',
    'exists' => 'The selected :attribute недействителен.',
    'file' => 'The :attribute должен быть файлом.',
    'filled' => 'The :attribute Атрибут должно иметь значение.',
    'gt' => [
        'numeric' => 'The :attribute должен быть больше, чем :value.',
        'file' => 'The :attribute должен быть больше, чем :value kilobytes.',
        'string' => 'The :attribute должен быть больше, чем :value characters.',
        'array' => 'The :attribute должен иметь более :value items.',
    ],
    'gte' => [
        'numeric' => 'The :attribute должен быть больше или равен :value.',
        'file' => 'The :attribute должен быть больше или равен :value kilobytes.',
        'string' => 'The :attribute должен быть больше или равен :value characters.',
        'array' => 'The :attribute должен иметь :value items or more.',
    ],
    'image' => 'The :attribute должен быть изображением.',
    'in' => 'The selected :attribute недействителен.',
    'in_array' => 'The :attribute Атрибут не существует в :other.',
    'integer' => 'The :attribute должен быть целым числом.',
    'ip' => 'The :attribute должен быть действительным IP-адресом.',
    'ipv4' => 'The :attribute должен быть действительным адресом IPv4.',
    'ipv6' => 'The :attribute должен быть действительным адресом IPv6.',
    'json' => 'The :attribute должен быть допустимой строкой JSON.',
    'lt' => [
        'numeric' => 'The :attribute должен быть меньше :value.',
        'file' => 'The :attribute должен быть меньше:value kilobytes.',
        'string' => 'The :attribute должен быть меньше :value characters.',
        'array' => 'The :attribute должен иметь меньше чем :value items.',
    ],
    'lte' => [
        'numeric' => 'The :attribute должен быть меньше или равен :value.',
        'file' => 'The :attribute должен быть меньше или равен:value kilobytes.',
        'string' => 'The :attribute должен быть меньше или равен :value characters.',
        'array' => 'The :attribute не должен иметь более :value items.',
    ],
    'max' => [
        'numeric' => 'The :attribute не может быть больше, чем :max.',
        'file' => 'The :attribute не может быть больше, чем :max kilobytes.',
        'string' => 'The :attribute не может быть больше, чем :max characters.',
        'array' => 'The :attribute не может иметь более :max items.',
    ],
    'mimes' => 'The :attribute должен быть файлом типа: :values.',
    'mimetypes' => 'The :attribute должен быть файлом типа: :values.',
    'min' => [
        'numeric' => 'The :attribute должен быть не менее :min.',
        'file' => 'The :attribute должен быть не менее :min kilobytes.',
        'string' => 'The :attribute должен быть не менее :min characters.',
        'array' => 'The :attribute должен быть не менее :min items.',
    ],
    'not_in' => 'The selected :attribute недействителен.',
    'not_regex' => 'The :неверный формат Атрибут.',
    'numeric' => 'The :attribute должен быть числом.',
    'present' => 'The :attribute Атрибут должно присутствовать.',
    'regex' => 'The :неверный формат Атрибут.',
    'required' => 'The :attribute Атрибут обязательно.',
    'required_if' => 'The :attribute Атрибут требуется, когда :other is :value.',
    'required_unless' => 'The :attribute Атрибут является обязательным, если только :other is in :values.',
    'required_with' => 'The :attribute Атрибут требуется, когда :values is present.',
    'required_with_all' => 'The :attribute Атрибут требуется, когда :values are present.',
    'required_without' => 'The :attribute Атрибут требуется, когда :values is not present.',
    'required_without_all' => 'The :attribute Атрибут является обязательным, если ни один из :values are present.',
    'same' => 'The :attribute и :other must match.',
    'size' => [
        'numeric' => 'The :attribute должен быть :size.',
        'file' => 'The :attribute должен быть :size kilobytes.',
        'string' => 'The :attribute должен быть:size characters.',
        'array' => 'The :attribute должен содержать :size items.',
    ],
    'starts_with' => 'The :attribute должен начинаться с одного из следующих: :values',
    'string' => 'The :attribute должен быть строкой.',
    'timezone' => 'The :attribute должен быть допустимой зоной.',
    'unique' => 'The :attribute уже занят.',
    'uploaded' => 'The :attribute не удалось загрузить.',
    'url' => 'The :неверный формат Атрибут.',
    'uuid' => 'The :attribute должен быть допустимым UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
