Vagrant.configure("2") do |config|

  config.vm.define "ammo_mongo" do |ammo|
    ammo.vm.provider "docker" do |d|
      d.name = "db"
      d.image   = "deini/mongodb"
      d.ports   = ["27017:27017", "28017:28017"]

      if ENV['AMMO_IS_PRODUCTION'].nil?
        d.vagrant_vagrantfile = "./Vagrantfile.proxy"
      end
    end
  end

  config.vm.define "ammo_nodejs" do |ammo|
    ammo.vm.synced_folder ".", "/ammo"
    ammo.vm.provider "docker" do |d|
      d.image = "deini/nodejs"
      d.link "db:ammo_mongo"
      d.cmd = ["bash", "-c", "pm2 start /ammo/server.js --watch && pm2 logs"]

      if ENV['AMMO_IS_PRODUCTION'].nil?
        d.vagrant_vagrantfile = "./Vagrantfile.proxy"
        d.ports = ["3000:3000"]
      else
        d.ports = ["80:3000"]
      end
    end
  end

end

