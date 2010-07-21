class UserObserver < ActiveRecord::Observer
  
  def after_create(user)
    user.send_verification_email
  end

end
