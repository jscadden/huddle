module ModelHelpers

  Dir.entries(Rails.root + "app/models").each do |filename|
    next if /^\./ === filename
    next unless /\.rb$/ === filename

    model_name = File.basename(filename, File.extname(filename))
    model_class = model_name.classify.constantize
    define_method(:"newest_#{model_name}") do
      model_class.find(:first, :order => "created_at DESC") ||
        Factory(model_name)
    end
  end

end

World(ModelHelpers)
