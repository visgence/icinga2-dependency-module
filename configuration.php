<?php
$section = $this->menuSection(
    N_('Dependencies')
)->setUrl('dependency_plugin/graph/home')->setIcon('plus'
)->setRenderer(array(
    'SummaryNavigationItemRenderer',
    'state' => 'critical'
));

// $section->add(N_('Hierarchy Map'))
//     ->setUrl('dependency_plugin/graph/hierarchy');
// $section->add(N_('Network Map'))
//     ->setUrl('dependency_plugin/graph/network');
$section->add(N_('Settings'))
    ->setUrl('dependency_plugin/graph/settings');

$this->provideJsFile('fullscreenMode.js');
$this->provideJsFile('drawDependencies.js');
$this->provideJsFile('vendor/vis.min.js');
$this->provideJsFile('drawDependencies.js');
$this->provideJsFile('getRequests.js');
$this->provideJsFile('kickstartManager.js');
$this->provideJsFile('settingsManager.js');
// $this->provideCssFile('vendor/network.css');

?>