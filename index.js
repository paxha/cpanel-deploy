const core = require('@actions/core');
const axios = require('axios');

const main = async () => {
    const timeStart = new Date();
    try {
        const host = core.getInput('host', { required: true });
        const port = core.getInput('port', { required: false });
        const username = core.getInput('username', { required: true });
        const apiToken = core.getInput('api_token', { required: true });
        const remotePath = core.getInput('remote_path', { required: true });
        const branch = core.getInput('branch', { required: false });

        const baseUrl = `${host}:${port}/execute/`;

        core.info(`baseUrl: ${baseUrl}`);

        const instance = axios.create({
            baseURL: baseUrl,
            timeout: 1000,
            headers: { "Authorization": `cpanel ${username}:${apiToken}` }
        });

        instance.get(`VersionControl/update`, {
            params: {
                repository_root: remotePath,
                branch: branch
            }
        }).then(response => {
            console.info(`${JSON.stringify(response.data, null, 2)}`);

            if (response.data.status === 1) {
                console.info(`Branch ${branch} updated successfully`);

                instance.get('VersionControlDeployment/create', {
                    params: {
                        repository_root: remotePath,
                    }
                }).then(response => {
                    console.info(`${JSON.stringify(response.data, null, 2)}`);

                    if (response.data.status === 1) {
                        console.info(`Deployment for branch ${branch} created successfully`);
                    } else {
                        throw new Error(`Deployment for branch ${branch} failed`);
                    }
                }).catch(error => {
                    console.log(error);
                    throw new Error(error);
                })

            } else {
                throw new Error(`Branch ${branch} update failed`);
            }

        }).catch(error => {
            console.log(error);
            throw new Error(error);
        });

        const duration = new Date() - timeStart;
        core.setOutput("duration", duration);
    } catch (error) {
        const duration = new Date() - timeStart;
        core.setOutput('duration', duration);

        core.setFailed(error.message);
    }
};