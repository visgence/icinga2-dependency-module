<?php
$section = $this->menuSection(
    N_('Dependencies')
)->setUrl('dependency_plugin/module/network')->setIcon('plus'
)->setRenderer(array(
    'SummaryNavigationItemRenderer',
    'state' => 'critical'
));

$section->add(N_('Settings'))
    ->setUrl('dependency_plugin/module/settings');

$this->provideJsFile('fullscreenMode.js');
$this->provideJsFile('graphManager.js');
$this->provideJsFile('vendor/vis.min.js');
$this->provideJsFile('graphManager.js');
$this->provideJsFile('requestsManager.js');
$this->provideJsFile('kickstartManager.js');
$this->provideJsFile('errorManager.js');
$this->provideJsFile('settingsManager.js');


?>