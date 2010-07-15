require "fileutils"

if !ENV["HEROKU_TYPE"].blank?
  FileUtils.mkdir_p(Rails.root.join("tmp", "stylesheets", "compiled"))
  ActionController::Dispatcher.middleware.use(Rack::Static, :root => "tmp/", :urls => ["/stylesheets/compiled"])
end
