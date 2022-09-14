# Install Node and Git
yum update -y
curl -sL https://rpm.nodesource.com/setup_14.x | bash -
yum install -y nodejs git


# Make a directory to clone the strapilication code to
mkdir -p /home/ec2-user/strapi && cd /home/ec2-user/strapi
git clone https://github.com/XamHans/dao-strategies .

# Install Dependencies
sudo npm install