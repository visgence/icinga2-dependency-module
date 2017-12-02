<?php
$section = $this->menuSection(
    N_('Dependencies')
)->setUrl('dependency_plugin/graph/display/hierarchy')->setIcon('plus'
)->setRenderer(array(
    'SummaryNavigationItemRenderer',
    'state' => 'critical'
));

$section->add(N_('Hierarchy Map'))
    ->setUrl('dependency_plugin/graph/display/hierarchy');
$section->add(N_('Network Map'))
    ->setUrl('dependency_plugin/graph/display/network');


$this->provideJsFile('vendor/fullscreenMode.js');
$this->provideJsFile('vendor/drawDependencies.js');
$this->provideJsFile('vendor/vis.min.js');
// $this->provideCssFile('vendor/network.css');

?>