class ActionMailer::Base
  default_url_options[:host] = ENV["URL"] || "huddle.localhost"
#  default_url_options[:port] = 3000
end
