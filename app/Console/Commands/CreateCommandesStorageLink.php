<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CreateCommandesStorageLink extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:link-commandes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create symbolic link for commandes storage directory';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $target = storage_path('app/public/commandes');
        $link = public_path('storage/commandes');

        // Créer le dossier target s'il n'existe pas
        if (!file_exists($target)) {
            mkdir($target, 0755, true);
            $this->info('Created commandes storage directory: ' . $target);
        }

        // Créer le lien symbolique s'il n'existe pas
        if (!file_exists($link)) {
            if (PHP_OS_FAMILY === 'Windows') {
                // Sur Windows, utiliser mklink
                $command = 'mklink /D "' . $link . '" "' . $target . '"';
                exec($command, $output, $exitCode);
                
                if ($exitCode === 0) {
                    $this->info('The [public/storage/commandes] link has been connected to [storage/app/public/commandes].');
                } else {
                    $this->error('Failed to create symbolic link on Windows.');
                }
            } else {
                // Sur Linux/Mac, utiliser symlink
                if (symlink($target, $link)) {
                    $this->info('The [public/storage/commandes] link has been connected to [storage/app/public/commandes].');
                } else {
                    $this->error('Failed to create symbolic link.');
                }
            }
        } else {
            $this->info('The [public/storage/commandes] link already exists.');
        }

        return 0;
    }
}
