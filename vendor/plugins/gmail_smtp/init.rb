if Rails.env.production? && "1.8.6" == VERSION
  require 'smtp_tls'
end
require 'actionmailer_gmail'
