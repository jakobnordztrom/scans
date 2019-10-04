FROM node:8-alpine

#Output directory, mount to volume
RUN mkdir /mnt/scans

#Use nexus npm repo
ADD build/.npmrc /root/.npmrc

# Install cloudsploit/scan into the container using npm from NPM
ADD package.json .
ADD index.js .
ADD exports.js .
ADD engine.js .
COPY postprocess ./postprocess/
COPY plugins ./plugins/
COPY other_modules ./other_modules/
COPY helpers ./helpers/
COPY compliance ./compliance/
COPY collectors ./collectors/

RUN  npm install

# By default, run the scan. CMD allows consumers of the container to supply
# command line arguments to the run command to control how this executes.
# Thus, you can use the parameters that you would normally give to index.js
# when running in a container.
ENTRYPOINT ["node", "index.js"]
CMD []
