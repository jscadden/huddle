desc "Generate a TAGS file for emacs"
task :tags do 
  JS_FILES = FileList["**/*.js"].exclude("pkg")
  RUBY_FILES = FileList["**/*.rb"].exclude("pkg")
  sh "ctags -e #{RUBY_FILES} #{JS_FILES}", :verbose => false
end
