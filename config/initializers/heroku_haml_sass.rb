# adapted from 
# http://github.com/pedro/hassle/issues/closed#issue/4 (follow Mislav's code)

require 'haml/helpers/action_view_mods'
require 'haml/helpers/action_view_extensions'
require 'haml/template'
require 'sass'
require 'sass/plugin'

Rails::Configuration.class_eval do
  attr_writer :heroku

  def initialize
    super
    @heroku = !ENV['HEROKU_TYPE'].blank?
  end

  def heroku?
    @heroku
  end
end

# based on suggestion from Chris Eppstein:
# http://github.com/chriseppstein/compass/issues/issue/130/#comment_238101
Sass::Plugin.options[:css_location] = [
  !ENV['HEROKU_TYPE'].blank? ? "#{Rails.root}/tmp/stylesheets" : "#{Rails.root}/public/stylesheets"
]

if !ENV['HEROKU_TYPE'].blank?
  # add Rack middleware to serve compiled stylesheets from "tmp/stylesheets"
  Rails.configuration.middleware.insert_after 'Sass::Plugin::Rack', 'Rack::Static', :urls => ['/stylesheets'], :root => "#{Rails.root}/tmp"
end
