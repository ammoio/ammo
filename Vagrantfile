Vagrant.configure("2") do |config|

  config.vm.define "ammo_mongo" do |ammo|
    ammo.vm.provider "docker" do |d|
      d.name = "db"
      d.image   = "deini/mongodb"
      d.ports   = ["27017:27017", "28017:28017"]
      d.vagrant_vagrantfile = "./Vagrantfile.proxy"
    end
  end

  config.vm.define "ammo_nodejs" do |ammo|
    ammo.vm.synced_folder ".", "/ammo"
    ammo.vm.provider "docker" do |d|
      d.image   = "deini/nodejs"
      d.ports   = ["3000:3000"]
      d.link "db:ammo_mongo"
      d.vagrant_vagrantfile = "./Vagrantfile.proxy"
      d.cmd = ["bash", "-c", "pm2 start /ammo/server.js --watch && pm2 logs"]
    end
  end

end

