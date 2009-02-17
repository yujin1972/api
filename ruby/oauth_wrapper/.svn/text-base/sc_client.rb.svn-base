require 'rubygems'

# For convenience
require 'json'
require 'active_support'

gem 'oauth', '0.2.7'
require 'oauth/consumer'

def reload!
  puts "Reloading '#{__FILE__}'"
  load __FILE__
end

module SC
  class Client
    attr_accessor :access_token, :request_token, :authorize_url
    attr_reader :consumer

    def initialize(host, key, secret, api_subdomain = "")
      @consumer = OAuth::Consumer.new(key, secret, {
        :site               => "http://#{api_subdomain}#{host}/",
        :request_token_path => "/oauth/request_token",
        :access_token_path  => "/oauth/access_token",
        :authorize_path     => "/oauth/authorize",
        :scheme             => :query_string
      })
      @authorize_url = "http://#{host}/oauth/authorize?oauth_token="
    end

    def get_request_token
      @request_token = @consumer.get_request_token
    end

    def check_request_token
      if @request_token.nil?
        raise "No request token"
      end
    end

    def check_access_token
      if @access_token.nil?
        raise "No access token"
      end
    end

    def authorize_url(callback_url = "")
      check_request_token
      "#{@authorize_url}#{@request_token.token}&oauth_callback=#{callback_url}"
    end

    def get_access_token
      check_request_token

      # When request token is authorized, get access token
      @access_token = request_token.get_access_token
      if test_request_ok?
        puts "# Access granted."
        @access_token
      else
        puts "# Access denied."
      end
    rescue Net::HTTPServerException => e
      raise "Token was probably not authenticated."
    end

    def build_options(options)
      default_options = {:params => {}, :headers => {"Accept" => "application/json"}}
      default_options.merge(options)
    end

    def do_request(method = :get, path = "/", options = {})
      check_access_token
      
      options = build_options options
      headers = options[:headers]
      @access_token.send(method, path, headers)
    end

    def test_request_ok?
      do_request(:get, "/oauth/test_request").code == "200"
    end

    def who_am_i
      do_request(:get, "/me/").body
    end
  end
end
