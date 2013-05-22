Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, "600450356645923", "01f29e86bbed474c1189809f0450649d"
end