<?php
/*
Plugin Name: REST API Dokumentumtár 
Plugin URI: http://www.szigetkoz.net/
Description: Ez a plugin REST API segítségével szolgáltat adatokat a megadott könyvtárszerkezetről az wp-content/uploads mappából.
Version: 0.1
Author: Bárkányi Dominik
Author URI: https://github.com/barkanyidominik
*/

require_once(ABSPATH . 'wp-admin/includes/file.php'); // ABSPATH - Wordpress home directory
setlocale(LC_ALL,'en_US.UTF-8');

class Documents
{
    function ListDocuments($folder)
    {
        $homePath = get_home_path();
        $dir = $homePath . 'wp-content/uploads/' . $folder;
        
        $url = get_site_url() . '/wp-content/uploads/' . $folder;

        $output = array();
        
        if(!is_dir($dir))
        {
            $output = false;
        }
        else
        {
            $documents = scandir($dir);
            foreach($documents as $file)
            {
                if($file != '.' && $file != '..' && $file[0] != '.')
                {
                    $path_parts = pathinfo($file);
                    $full_path = $dir . '/' . $file;

                    $file_info = array(
                        'dir' => is_dir($full_path), 
                        'basename' => $path_parts['basename'], 
                        'filename' => $path_parts['filename'], 
                        'filepath' => $folder . '/' . $path_parts['basename'] ,
                        'fileurl' => $url . '/' . $path_parts['basename']
                    );

                    array_push($output, $file_info);
                }
            }
        }
        return $output;
    }
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'documents', '/dir/(?P<dir>(.)+)', array(
      'methods' => 'GET',
      'callback' => 'callback',
    ) );
} );

function callback($data)
{
    //return urldecode($data['dir']);
    global $Documents;
    $Documents = new Documents();
    $Documents = $Documents->ListDocuments(urldecode($data['dir']));
    return $Documents;
}

?>
