settings = {
  :address => "smtp.gmail.com",
  :port => 587,
  :authentication => :plain,
  :domain => ENV['GMAIL_SMTP_USER'],
  :user_name => ENV['GMAIL_SMTP_USER'],
  :password => ENV['GMAIL_SMTP_PASSWORD'],
} 
if "1.8.6" != VERSION
  settings.merge!(:enable_starttls_auto => true)
end
ActionMailer::Base.smtp_settings = settings
