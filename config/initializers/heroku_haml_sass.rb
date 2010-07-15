require "fileutils"

module HerokuCheck
  def heroku?
    !!ENV["HEROKU_TYPE"]
  end
end
Rails.send(:extend, HerokuCheck)


if Rails.heroku?
  FileUtils.mkdir_p(Rails.root.join("tmp", "stylesheets", "compiled"))
  ActionController::Dispatcher.middleware.use(Rack::Static, :root => "tmp/", :urls => ["/stylesheets/compiled"])

  Sass::Plugin.options[:template_location] = {
    "app/stylesheets" => "tmp/stylesheets/compiled"
  }
end

