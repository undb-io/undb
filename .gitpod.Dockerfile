FROM gitpod/workspace-full:latest

RUN bash -c 'VERSION="20.3.0" \
	&& source $HOME/.nvm/nvm.sh && nvm install $VERSION \
	&& nvm use $VERSION && nvm alias default $VERSION'

RUN npm install -g pnpm@8.6.2

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix