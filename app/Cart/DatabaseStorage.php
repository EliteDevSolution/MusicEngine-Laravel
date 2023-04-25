<?php
/**
 * Created by NiNaCoder.
 * Date: 2021-01-17
 * Time: 22:27
 */

namespace App\Cart;

use Illuminate\Database\Eloquent\Model;

class DatabaseStorage extends Model
{
    protected $table = 'cart_storage';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'cart_data',
    ];

    public function setCartDataAttribute($value)
    {
        $this->attributes['cart_data'] = serialize($value);
    }

    public function getCartDataAttribute($value)
    {
        return unserialize($value);
    }
}