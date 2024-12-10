# Use an official Java base image with Node.js support
FROM openjdk:8-jdk

# Install Node.js and required tools
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs unzip curl && \
    apt-get clean

# Set working directory
WORKDIR /opt

# Gatling version
ENV GATLING_VERSION 2.2.5

# Create directory for Gatling installation
RUN mkdir -p gatling

# Install Gatling
RUN mkdir -p /tmp/downloads && \
    curl -sf -o /tmp/downloads/gatling-$GATLING_VERSION.zip \
    -L https://repo1.maven.org/maven2/io/gatling/highcharts/gatling-charts-highcharts-bundle/$GATLING_VERSION/gatling-charts-highcharts-bundle-$GATLING_VERSION-bundle.zip && \
    mkdir -p /tmp/archive && cd /tmp/archive && \
    unzip /tmp/downloads/gatling-$GATLING_VERSION.zip && \
    mv /tmp/archive/gatling-charts-highcharts-bundle-$GATLING_VERSION/* /opt/gatling/ && \
    rm -rf /tmp/downloads /tmp/archive

# Set Gatling environment variables
ENV PATH /opt/gatling/bin:$PATH
ENV GATLING_HOME /opt/gatling

# Set Node.js working directory
WORKDIR /app

# Copy Node.js files (if applicable)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose Gatling volumes for configuration and results
VOLUME ["/opt/gatling/conf", "/opt/gatling/results", "/opt/gatling/user-files"]

# Default command to run Gatling simulation via Node.js
CMD ["npx", "gatling", "run", "--simulation", "computerdatabase"]
