<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines - バリデーション翻訳文
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    | 次の翻訳文は、バリデータークラスで使用されるデフォルトのエラーメッセージです。
    | サイズルールなど、複数のバージョンを持つものもあります。
    | ここで自由にメッセージを変更することができます。
    |
    */

    'accepted' => ':attributeに同意する必要があります。',
    'active_url' => ':attributeは有効なURLではありません。',
    'after' => ':attributeは、:date以降の日付である必要があります。',
    'after_or_equal' => ':attributeは、:dateか、それ以降の日付である必要があります。',
    'alpha' => ':attributeは、文字のみ使用できます。',
    'alpha_dash' => ':attributeは、英数字とハイフン、アンダーバーのみ使用できます。',
    'alpha_num' => ':attributeは、英数字のみ使用できます。',
    'array' => ':attributeは、配列である必要があります。',
    'before' => ':attributeは、:dateよりも前の日付である必要があります。',
    'before_or_equal' => ':attributeは、:dateか、それよりも以前の日付である必要があります。',
    'between' => [
        'numeric' => ':attributeは、:minから:maxである必要があります',
        'file' => ':attributeは、:minから:max KBである必要があります。',
        'string' => ':attributeは、:min文字から:max文字である必要があります。',
        'array' => ':attributeは、:minから:max 個である必要があります。',
    ],
    'boolean' => ':attribute欄は、有効か無効のどちらかである必要があります。',
    'confirmed' => ':attributeの確認が一致しません。',
    'date' => ':attributeは有効な日付ではありません。',
    'date_equals' => ':attributeは、:dateである必要があります。',
    'date_format' => ':attributeは、次の形式ではありません： :format.',
    'different' => ':attributeと:otherは異なる必要があります。',
    'digits' => ':attributeは、:digits桁である必要があります。',
    'digits_between' => ':attributeは、:minから:max桁である必要があります。',
    'dimensions' => ':attributeは、無効なサイズです。',
    'distinct' => ':attributeは、同じ値が入力されています。',
    'email' => ':attributeは、有効なメールアドレスである必要があります。',
    'exists' => '選択された:attributeは無効です。',
    'file' => ':attributeは、ファイルである必要があります。',
    'filled' => ':attribute欄は、値が入力されている必要があります。',
    'gt' => [
        'numeric' => ':attributeは、:valueより大きい必要があります。',
        'file' => ':attributeは、:value KBよりも大きい必要があります。',
        'string' => ':attributeは、:value文字よりも多い必要があります。',
        'array' => ':attributeは、:value個よりも多い必要があります。',
    ],
    'gte' => [
        'numeric' => ':attributeは、:valueか、それ以上である必要があります。',
        'file' => ':attributeは、:value KBか、それ以上である必要があります。',
        'string' => ':attributeは、:value文字か、それ以上である必要があります。',
        'array' => ':attributeは、:value個か、それ以上である必要があります。',
    ],
    'image' => ':attributeは、画像である必要があります。',
    'in' => '選択された:attributeは無効です。',
    'in_array' => ':attributeは、:otherに存在しません。',
    'integer' => ':attributeは、整数である必要があります。',
    'ip' => ':attributeは、有効なIPアドレスである必要があります。',
    'ipv4' => ':attributeは、有効なIPv4アドレスである必要があります。',
    'ipv6' => ':attributeは、有効なIPv6アドレスである必要があります。',
    'json' => ':attributeは、有効なJSON構文である必要があります。',
    'lt' => [
        'numeric' => ':attributeは、:value未満である必要があります。',
        'file' => ':attributeは、:value KB未満である必要があります。',
        'string' => ':attributeは、:value文字未満である必要があります。',
        'array' => ':attributeは、:value個未満である必要があります。',
    ],
    'lte' => [
      'numeric' => ':attributeは、:valueか、それ以下である必要があります。',
      'file' => ':attributeは、:value KBか、それ以下である必要があります。',
      'string' => ':attributeは、:value文字か、それ以下である必要があります。',
      'array' => ':attributeは、:value個か、それ以下である必要があります。',
    ],
    'max' => [
      'numeric' => ':attributeは、:valueより小さい必要があります。',
      'file' => ':attributeは、:value KBより小さい必要があります。',
      'string' => ':attributeは、:value文字より小さい必要があります。',
      'array' => ':attributeは、:value個より小さい必要があります。',
    ],
    'mimes' => ':attributeのファイルタイプは次の通りである必要があります: :values.',
    'mimetypes' => ':attributeは、次のファイルタイプである必要があります: :values.',
    'min' => [
        'numeric' => ':attributeは、最低でも:minである必要があります。',
        'file' => ':attributeは、最低でも:min KBである必要があります。',
        'string' => ':attributeは、最低でも:min文字である必要があります。',
        'array' => ':attributeは、最低でも:min個である必要があります。',
    ],
    'not_in' => '選択された:attributeは無効です。',
    'not_regex' => ':attribute形式は無効です。',
    'numeric' => ':attributeは数字である必要があります。',
    'present' => ':attribute欄が入力されている必要があります。',
    'regex' => ':attribute形式は無効です。',
    'required' => ':attribute欄は必須項目です。',
    'required_if' => ':otherが:valueの時は、:attributeは必須項目です。',
    'required_unless' => ':otherが:valuesにない時は、:attributeは必須項目です。',
    'required_with' => ':valuesが存在する時は、:attributeは必須項目です。',
    'required_with_all' => ':valuesが存在する時は、:attributeは必須項目です。',
    'required_without' => ':valuesが存在する時は、:attributeは必須項目です。',
    'required_without_all' => ':valuesが存在しない時は、:attributeは必須項目です。',
    'same' => ':attributeと:otherが一致している必要があります。',
    'size' => [
        'numeric' => ':attributeは、:sizeである必要があります。',
        'file' => ':attributeは、:size KBである必要があります。',
        'string' => ':attributeは、:size文字である必要があります。',
        'array' => ':attributeは、:size個を含んでいる必要があります。',
    ],
    'starts_with' => ':attributeは、次のどれかから始まる必要があります: :values',
    'string' => ':attributeは文字列である必要があります。',
    'timezone' => ':attributeは有効なタイムゾーンである必要があります。',
    'unique' => ':attributeは、既に使用されています。',
    'uploaded' => ':attributeのアップロードに失敗しました。',
    'url' => ':attribute形式は無効です。',
    'uuid' => ':attributeは、有効なUUIDである必要があります。',

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
