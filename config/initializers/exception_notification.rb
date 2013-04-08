if Rails.env.production?
  ExceptionNotification::Notifier.exception_recipients = ["huddlewebsite@wagileconsulting.com"]
end

ExceptionNotification::Notifier.sender_address = "huddle@wagileconsulting.com"
ExceptionNotification::Notifier.email_prefix = "[Huddle Error] "

