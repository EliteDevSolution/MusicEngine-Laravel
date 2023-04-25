<?php

use Illuminate\Database\Seeder;

class BannersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('banners')->delete();
        
        \DB::table('banners')->insert(array (
            0 => 
            array (
                'id' => 2,
                'banner_tag' => 'header',
                'description' => 'Top banner',
                'code' => '<div class="header-ad">
<a href="http://ninacoder.info" target="_blank"><img src="https://user-images.githubusercontent.com/63708869/97975081-20d8ad80-1dfb-11eb-8ffe-ba78c4fa9000.png" alt=""></a>
</div>',
                'approved' => 1,
                'short_place' => 0,
                'bstick' => 0,
                'main' => 0,
                'category' => '',
                'group_level' => 'all',
                'started_at' => '2020-09-08 13:48:00',
                'ended_at' => '2020-12-31 13:46:00',
                'fpage' => 0,
                'innews' => 0,
                'device_level' => '',
                'allow_views' => 0,
                'max_views' => 0,
                'allow_counts' => 0,
                'max_counts' => 0,
                'views' => 0,
                'clicks' => 0,
                'rubric' => 0,
                'created_at' => '2020-09-07 13:48:00',
                'updated_at' => '2020-11-03 10:36:54',
            ),
            1 => 
            array (
                'id' => 3,
                'banner_tag' => 'footer',
                'description' => 'Footer ad',
                'code' => '<div class="footer-ad">
<a href="http://ninacoder.info" target="_blank"><img src="https://user-images.githubusercontent.com/63708869/93670112-d5747500-fac2-11ea-8bdf-56427ed7d2a2.jpg" alt=""></a>
</div>',
                'approved' => 1,
                'short_place' => 0,
                'bstick' => 0,
                'main' => 0,
                'category' => NULL,
                'group_level' => 'all',
                'started_at' => '2020-11-01 16:58:00',
                'ended_at' => '2026-11-26 16:59:00',
                'fpage' => 0,
                'innews' => 0,
                'device_level' => '',
                'allow_views' => 0,
                'max_views' => 0,
                'allow_counts' => 0,
                'max_counts' => 0,
                'views' => 0,
                'clicks' => 0,
                'rubric' => 0,
                'created_at' => '2020-11-03 09:59:26',
                'updated_at' => '2020-11-03 10:18:16',
            ),
            2 => 
            array (
                'id' => 4,
                'banner_tag' => 'sidebar',
                'description' => 'Sidebar ad',
                'code' => '<div class="sidebar-ad">
<a href="http://ninacoder.info" target="_blank"><img src="https://user-images.githubusercontent.com/63708869/97974829-bf184380-1dfa-11eb-9ad5-8849be2e2d9d.jpeg" alt=""></a>
</div>',
                'approved' => 1,
                'short_place' => 0,
                'bstick' => 0,
                'main' => 0,
                'category' => NULL,
                'group_level' => 'all',
                'started_at' => '2020-11-01 17:03:00',
                'ended_at' => '2025-11-01 17:03:00',
                'fpage' => 0,
                'innews' => 0,
                'device_level' => '',
                'allow_views' => 0,
                'max_views' => 0,
                'allow_counts' => 0,
                'max_counts' => 0,
                'views' => 0,
                'clicks' => 0,
                'rubric' => 0,
                'created_at' => '2020-11-03 10:04:00',
                'updated_at' => '2020-11-03 10:34:06',
            ),
        ));
        
        
    }
}