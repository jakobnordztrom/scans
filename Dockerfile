FROM node:8-alpine

#Output directory, mount to volume
RUN mkdir /mnt/cloudsploit

#Use nexus npm repo
ADD build/.npmrc /root/.npmrc

# Install cloudsploit/scan into the container using npm from NPM
RUN mkdir /var/scan/
ADD package.json /var/scan/
ADD index.js /var/scan/
ADD exports.js /var/scan/
ADD engine.js /var/scan/
COPY postprocess /var/scan/postprocess/
COPY plugins /var/scan/plugins/
COPY other_modules /var/scan/other_modules/
COPY helpers /var/scan/helpers/
COPY compliance /var/scan/compliance/
COPY collectors /var/scan/collectors/

RUN  cd /var/scan && npm install

# Setup the container's path so that you can run cloudsploit directly
# in case someone wants to customize it when running the container.
ENV PATH "$PATH:/var/scan/node_modules/.bin"

# By default, run the scan. CMD allows consumers of the container to supply
# command line arguments to the run command to control how this executes.
# Thus, you can use the parameters that you would normally give to index.js
# when running in a container.
ENTRYPOINT ["cloudsploitscan"]
CMD []
