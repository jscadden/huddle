Rake.application.instance_variable_get("@tasks").delete("default")
task :default => :specs_and_features

desc "Run specs and features"
task :specs_and_features do
  Rake::Task["spec"].invoke
  Rake::Task["cucumber"].invoke
end

