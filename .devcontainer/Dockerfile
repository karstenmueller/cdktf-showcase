FROM node:alpine

# Install cdktf
RUN npm install --global cdktf-cli

RUN apk add --no-cache curl unzip bash git && \
    rm -rf /var/cache/apk/*

# Install Terraform
ENV TERRAFORM_VERSION="1.0.4"
RUN cd /tmp && curl -LOk https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip -d /usr/local/bin

# Install pulumi
ENV PULUMI_VERSION="3.10.0"
RUN cd /tmp && curl -LOk "https://get.pulumi.com/releases/sdk/pulumi-v${PULUMI_VERSION}-linux-x64.tar.gz" && \
    tar xzf "pulumi-v${PULUMI_VERSION}-linux-x64.tar.gz" -C /usr/local && \
    ln -sf /usr/local/pulumi/pulumi /usr/local/bin/pulumi

# Check reuqiremnets
RUN cdktf --version && \
    terraform --version && \
    pulumi version

RUN adduser cdktf -Dh /home/cdktf -s /bin/bash
USER cdktf
WORKDIR /home/cdktf
