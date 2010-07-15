require 'yaml'
require 'ostruct'
require 'erb'

::OrbitedConfig = OpenStruct.new(YAML.load(ERB.new(File.open(File.join(Rails.root, 'config', 'orbited.yml')).read).result)[Rails.env])
ActionView::Base.send :include, OrbitedHelper

Orbited.set_defaults
