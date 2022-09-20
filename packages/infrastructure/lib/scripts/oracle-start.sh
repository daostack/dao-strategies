# Install Node and Git
yum update -y
curl -sL https://rpm.nodesource.com/setup_14.x | bash -
yum install -y nodejs git


# Make a directory to clone the strapilication code to
git clone https://github.com/XamHans/dao-strategies .


curl -o- -L https://yarnpkg.com/install.sh | bash

#cd into dao-strategies
cd dao-strategies


# Install Dependencies
sudo yarn install

