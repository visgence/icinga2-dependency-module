<?php
$section = $this->menuSection('Dependencies', array(
    'url' => 'dependency_plugin/graph/display',
    'icon' => 'thumbs-up'
));

$this->provideJsFile('vendor/drawDependencies.js');
$this->provideJsFile('vendor/vis.min.js');
// $this->provideCssFile('vendor/network.css');

?>