# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def save_button(text="Save")
    capture_haml do
      concat content_tag("button", image_tag("buttons/tick.png") + text,
                         :class => "button positive", :type => "submit",
                         :accesskey => "s")
    end
  end

  def show_flash
    flash.inject("") do |output, kv_pair|
      type, message = kv_pair
      output += content_tag("div", h(message), :class => "flash #{type}")
    end
  end
end
