const core = require('@actions/core');
const axios = require('axios');

core.info('Starting deployment...');

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
            headers: { "Authorization": `cpanel ${username}:${apiToken}` }
        });

        instance.get(`VersionControl/update`, {
            params: {
                repository_root: remotePath,
                branch: branch
            }
        }).then(response => {
            if (response.data.status === 1) {
                core.info(`Branch ${branch} updated successfully`);

                instance.get('VersionControlDeployment/create', {
                    params: {
                        repository_root: remotePath,
                    }
                }).then(response => {
                    if (response.data.status === 1) {
                        const taskId = response.data.data.task_id;

                        core.info(`Deployment for branch ${branch} created successfully with task id ${taskId}`);

                        let taskFinished = false;

                        while (!taskFinished) {
                            taskFinished = isTaskFinished(instance, taskId);
                            if (taskFinished) {
                                core.info(`Task ${taskId} status: Completed`);
                            } else {
                                core.info(`Task ${taskId} status: In-Progress...`);
                            }
                        }

                    } else {
                        throw new Error(`Deployment for branch ${branch} failed`);
                    }
                }).catch(error => {
                    console.error(error);
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

async function isTaskFinished(instance, taskId) {
    let taskFinished = true;

    await sleep(3000);

    instance.get('UserTasks/retrieve').then(response => {
        if (response.data.status === 1) {
            response.data.data.forEach(task => {
                if (task.id === taskId) {
                    taskFinished = false;

                    console.log(`inside taskFinished: ${taskFinished}`)
                }
            });
        } else {
            throw new Error(`Deployment tasks retrieval failed`);
        }
    }).catch(error => {
        console.log(error);
        throw new Error(error);
    });

    console.log(`outside taskFinished: ${taskFinished}`)

    return taskFinished;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

main();