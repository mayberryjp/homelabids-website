<template>
  <v-container class="pa-6">
    <v-card class="mb-6" color="#181c22" variant="tonal">
      <v-card-text>
        <div v-if="config">
          <div class="d-flex flex-wrap ga-4">
            <div class="configBubble"><strong>Site Name:</strong> {{ config.SiteName }}</div>
            <div class="configBubble"><strong>Version:</strong> {{ config.Version }}</div>
            <div class="configBubble"><strong>DB Schema:</strong> {{ config.DatabaseSchemaVersion }}</div>
            <div class="configBubble"><strong>Machine ID:</strong> {{ config.MachineUniqueIdentifier }}</div>
          </div>
        </div>
        <div v-else-if="configError" class="text-error">{{ configError }}</div>
        <div v-else>
          <v-progress-circular indeterminate size="20" color="primary" />
          <span class="ml-2">Loading configuration...</span>
        </div>
      </v-card-text>
    </v-card>

    <h1 class="text-h4 mb-4">Help & Documentation</h1>
    <v-divider class="mb-6"></v-divider>

    <v-expansion-panels multiple>
      <v-expansion-panel title="What is HomeLabIDS?">
        <v-expansion-panel-text>
          <p>
            <strong>HomeLabIDS</strong> is the most robust open-source security tool for your home lab. HomelabIDS monitors network traffic through your firewall or router and detects potentially malicious traffic. It gives you complete control and visibility to your network security. HomeLabIDS integrate with popular home lab platforms like PfSense and Pihole.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="How do I get started?">
        <v-expansion-panel-text>
          <p>
            After installation, only flow collection is enabled. Please navigate to Settings -> Processes to turn on detection processing or any other processing you want. Additionally, turn go to detections and start turning on detections that are interesting. New Host Detection is a simple first detection to enable and start profiling your network. Once you get more familiar with the system you can turn on other detections. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="What are known issues?">
        <v-expansion-panel-text>
          <p>
             Netflow doesn't have any idea of network topology. It just records flows going in and out of an interface. Therefore, it's often difficult to distinguish between a client and server in a flow conversation. We do our best to make some assumptions but they may be wrong.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="I have port SSH whitelisted on my network for a host inbound and now all outbound flows for SSH are whitelisted too. What gives?">
        <v-expansion-panel-text>
          <p>
             Yes, see above. It's difficult for Netflow to differentiate between clients and servers. This scenario is a potential risk. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Does Netflow increase load on my router/firewall?">
        <v-expansion-panel-text>
          <p>
             We haven't observed any negative impact at normal homelab traffic rates.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="What interfaces should I monitor and what netflow export interval?">
        <v-expansion-panel-text>
          <p>
             We recommend exporting flows every minute. We recommend monitoring only the LAN interfaces.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Understanding the Dashboard">
        <v-expansion-panel-text>
          <ul>
            <li><strong>Flow Explorer:</strong> View and search all network flows detected by the IDS.</li>
            <li><strong>Host Details:</strong> Click an IP address to see detailed info, threat score, tags, and traffic stats for a device.</li>
            <li><strong>Alert Bars:</strong> Visualize alert activity over time for each host.</li>
            <li><strong>Tags:</strong> Add custom tags to hosts for easier identification and classification.</li>
            <li><strong>Threat Score:</strong> Each host gets its own threat scored based on recent alert activity. The site also gets an overall threat score. </li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Common Actions">
        <v-expansion-panel-text>
          <ul>
            <li><strong>Create Alow Lists:</strong> Mark trusted or approved traffic so that it doesn't alert in the future.</li>
            <li><strong>Edit Host:</strong> Click the edit icon on a host detail page to update tags or allowlist status.</li>
            <li><strong>Refresh Data:</strong> Use the refresh button to reload the latest flows and alerts.</li>
            <li><strong>Settings:</strong> Access user and system settings from the profile menu.</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Troubleshooting">
        <v-expansion-panel-text>
          <ul>
            <li>If data is missing, try refreshing the page or check your network connection.</li>
            <li>For persistent issues, consult the browser console for errors or contact your system administrator.</li>
            <li>Issues and feature requests can be submitted from the link at the top of the HomelabIDS dashboard.</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Do you support IPFIX or IPv6?">
        <v-expansion-panel-text>
          <p>
            Not at the moment. Right now we support IPv4 and Netflow v5. In the future we plan to support IPv6 and IPFIX. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Why do I see HomelabIDS making outbound connections to the Internet?">
        <v-expansion-panel-text>
          <p>
            HomelabIDS may make outbound connections for various reasons, including: communicating with our central API, downloading GeoIP data or reputation databases. These are all optional features that can be disabled in Settings.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="What are the default ports that need to be exposed for HomelabIDS to work?">
        <v-expansion-panel-text>
          <p>
            The default ports that need to be exposed for HomeLabIDS to work are:
          </p>
          <ul>
            <li>HomelabIDS Dashboard: TCP/3030</li>
            <li>HomelabIDS Netflow Collector: UDP/2055</li>
            <li>HomelabIDS Local API: TCP/8044</li>
            <li>HomelabIDS Sinkhole DNS server (optional feature): TCP & UDP: 53</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Do you support MariaDB/mysql?">
        <v-expansion-panel-text>
          <p>
            Not at the moment. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
  
      <v-expansion-panel title="Why isn't the threat score updating?">
        <v-expansion-panel-text>
          <p>
            Threat score recalculates at the interval set for the Discovery Run Interval on the settings page. From Advanced settings, you can also manually force threat-score recalculation. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="The actions bell is saying there's an issue. What should I do?">
        <v-expansion-panel-text>
          <p>
            If it's not happening often then it may just be a transient issue you can acknowledge and ignore. If you see it happening very frequently then we suggest opting into all feature on the HomeLabsIDS Collaboration page in Settings. You can also follow the Submit Issue button in the navbar. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="What's the purpose of device tags?">
        <v-expansion-panel-text>
          <p>
            You can use it for whatever scenario you want. One idea is to add a tag to help you track a physical location, or a VLAN assignment or even details about how you're securing the device.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="What's the purpose of the export device feature?">
        <v-expansion-panel-text>
          <p>
            Right now there isn't one. But, we offer it as an option to see a device's full history of network and DNS activity and export all information we know about the device. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="The Traffic Stats seem high, what's the deal?">
        <v-expansion-panel-text>
          <p>
             The traffic stats are aggregrate traffic stats for the hour. They are not per second or minute traffic stats. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Can I run this on the same docker home as Pihole?">
        <v-expansion-panel-text>
          <p>
            You can but you will not be able to use the SinkholeDNS feature as both applications bind to port 53. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="What's the purpose of the SinkholeDNS server?">
        <v-expansion-panel-text>
          <p>
           The SinkholeDNS server is an optional feature that allows you to redirect DNS to an internal process that responds to NXDOMAIN for every DNS query. Many IoT devices use DNS to "phone home". By pointing these devices to SinkholeDNS, you can effectively prevent them from phoning home.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="How can I delete all alerts and is it bad to do that?">
        <v-expansion-panel-text>
          <p>
            During the initial installation and tuning process you may generate a lot of alerts. In the Advanced section of Settings is a button to delete all alerts. This is not necessarily a bad thing to do and we suggest recalculating threat score after also. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Can I delete all alerts for just a specific host?">
        <v-expansion-panel-text>
          <p>
            Yes, there is a delete alerts for a host under each host details page. Click on a host in the hosting listing panel. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>


      <v-expansion-panel title="What is the enable/disable notifications button?">
        <v-expansion-panel-text>
          <p>
            When going through the fine-tuning process you may want to enable all alerts for some hosts and disable all alerts for other hosts. You can achieve this by globally enabling alerting in Settings for each detection type and then selectively disabling alerting on a host by host basis. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>


      <v-expansion-panel title="I use VLANs with restrictive outbound firewall rules. Do I really need HomelabIDS?">
        <v-expansion-panel-text>
          <p>
            Sure! We offer other interesting features like device identification, DNS profiling, network traffic stats, etc. HomeLabIDS can act as a source of truth for what's on your homelab network!
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="What is the best way to secure my network?">
        <v-expansion-panel-text>
          <p>
            There is no solution for everyone as home networks vary greatly. You may have a flat network or you may have several vlans. We recommend using a firewall software like PfSense if you aren't already. The best practive is likely some combination of physical and logical seperations using VLANs especially for IoT devices, security cameras and mobile devices.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="There's a local device on my network and I don't know what it is. What should I do?">
        <v-expansion-panel-text>
          <p>
            We provide some tools like auto-device classification, OS finger-printing, and network behavior fingerprinting to help assist you. But, often times only you will know.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="I see something on my network talking to something on the Internet that I am not aware of. What should I do?">
        <v-expansion-panel-text>
          <p>
            These questions are not easy to answer and require a mix of researching, googling and using sites like shodan to try and understand if a connection is legitimate or malicious. In the future, we plan to offer more features to help with the investigative process.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="What's the purpose of the friendly name?">
        <v-expansion-panel-text>
          <p>
            This is a name you can assign to a host that is more descriptive than the IP address. It can be used to help you identify the host in the UI.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      
      <v-expansion-panel title="What's the purpose of the management link under edit host?">
        <v-expansion-panel-text>
          <p>
            This allows you to access a device's management website via HomeLabIDS. It's just a convenient feature that may be useful during the investigation process. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Why do all my hosts show up with a ? icon">
        <v-expansion-panel-text>
          <p>
            You can click on the host, edit it and assign a category. That will cause the icon to change. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="What notification mechanisms do you support?">
        <v-expansion-panel-text>
          <p>
            For each detection category you can set it to alert or notify. Currently we only support Telegram notification. You can also retrieve alerts from the API at /api/alerts. If you want more notification mechanisms to be supported then please following the Submit Features link. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Do configuration changes go into effect immediately?">
        <v-expansion-panel-text>
          <p>
            Generally, yes, although if you're seeing an issue then please restart the container. Some configurations like turning on and off processes or adding 'Other Networks' may require a restart. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Do you submit multiple local networks and multiple routers?">
        <v-expansion-panel-text>
          <p>
            Yes. Although we don't run our unit tests in these configurations so you may run into bugs. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Can I aggregrate many sites into one HomelabIDS instance?">
        <v-expansion-panel-text>
          <p>
            Probably, but we don't test in this topology so try and let us know how it works. You'll probably want to disable local flows detections. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="I have other private and remote networks in my home lab that don't show up in Flow Explorer correctly.">
        <v-expansion-panel-text>
          <p>
            You can define other private networks in the Settings 'Other Networks' page. Multiple Other Networks are supported. Please follow the configuration instructions on that page. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="I don't understand these NTP and DNS settings. Can you explain it?">
        <v-expansion-panel-text>
          <p>
            Many homelabs have their own DNS and NTP environment to maintain consistent time. For example, Pihole and Chrony are popular docker containers for DNS and NTP. HomelabIDS supports the ability to detect devices that aren't using your local DNS and NTP infrastructure as one of its detections. You can set your local DNS and NTP servers in Settings. You can also configure Pihole and Chrony to use specific public caching DNS servers and stratum NTP servers. This ensures those applications are only using the servers you want them to use. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="How can I debug and troubleshoot server issues?">
        <v-expansion-panel-text>
          <p>
            We emit extensive logs that are accessible by viewing container logs.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="How do I get geolocation data?">
        <v-expansion-panel-text>
          <p>
            You need a MaxMind free API key. The steps to do this can be found on the Internet. Once you have a key, please popuate it in the Settings -> Detection Fine Tuning page.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Where did you get that list of banned countries? Why is my country on it?">
        <v-expansion-panel-text>
          <p>
            This is an auto-generated list from ChatGPT. Please feel free to change it. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Do you support a mechanism to do automated deployments and centralized configuration management?">
        <v-expansion-panel-text>
          <p>
            Yes. You can set a sitename in the docker environment variable. Please see our example docker configs. You can then create a file in your docker volume for HomelabIDS called $SITE.py. This can contain all of the site configurations. The SITE config file will override any manually made settings at every restart. There is an example SITE.py file in our Github repository. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Do you have any community websites?">
        <v-expansion-panel-text>
          <p>
            YYes! We are r/homelabids on Reddit. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="How many flows per second can you handle?">
        <v-expansion-panel-text>
          <p>
            We haven't done any benchmark testing. Please share any experience you have on our reddit group. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Can I export the allow list and import it as firewall rules?">
        <v-expansion-panel-text>
          <p>
            Not at the moment but we believe this is a good feature to build soon. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="I keep deleting the broadcast address and it reappears. Make it stop?">
        <v-expansion-panel-text>
          <p>
             You don't need to delete the broadcast address host. Just classify it as a BROADCAST_ADDRESS and let it remain in the system.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="How can I see the flow that triggered the alert?">
        <v-expansion-panel-text>
          <p>
            In alert listings there's a caret down button that will show you a single flow record. If the detection has multiple flows, it will only show one. We are currently limited to storing just one flow for each alert. You can explore other similar flows in the Flow Explorer. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Can the website and backend be on seperate docker hosts?">
        <v-expansion-panel-text>
          <p>
             Yes, it should be supported. Please review the example docker compose file in our Github repo for homelabids-website.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="What's the number next to the host in host listing?">
        <v-expansion-panel-text>
          <p>
             It's a host specific threat score. It's used by calculating the volume of recent alerts for that host. It is recalcuated regularly based on your site configuration. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="How is the site risk calculated?">
        <v-expansion-panel-text>
          <p>
             It is the average of all of the localhosts threat score. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Why don't you support better application security?">
        <v-expansion-panel-text>
          <p>
            At the moment we don't support authentication or HTTPS and our API is not secured. We may improve this in the future. We expect people to run this locally and access it via their homelab network directly or over a secure VPN. We don't recommend exposing HomelabIDS to the Internet.  
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Everything is reporting in the wrong time zone. How do I fix it?">
        <v-expansion-panel-text>
          <p>
            Set the TZ docker environment variable to your local time zone. Our docker config examples demonstrate how to do this. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Device auto-classification is wrong. Why?">
        <v-expansion-panel-text>
          <p>
            Device auto-classification relies on various factors, including network behavior and traffic patterns. It also depends on our platform having seen this device on a network before. You can help others by opting into device classification in the settings page. When you opt-in, your local device classificaiton details will be submitted to our cloud and then be stored for future classification performed by others. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>


      <v-expansion-panel title="How can I add a new icon or device category?">
        <v-expansion-panel-text>
          <p>
            Email homelabids@gmail.com with the request or see how to contribute below. 
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Do you integrate with Pihole?">
        <v-expansion-panel-text>
          <p>Yes! HomeLabIDS integrates with Pihole to provide enhanced discovery of your local network. HomeLabIDS can learn about network devices via the DHCP and network devices API as well as match traffic patterns to DNS queries. We only support the Pihole v6 API.</p>
      
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Your app looks like Uptime Kuma. Are you affilaited with Uptime Kuma?">
        <v-expansion-panel-text>
          <p>
             No. We just liked the simplicity of their design and made a similar one. We also use VueJS like Uptime Kuma does.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Do you integrate with gethomepage.dev or Home Assistant?">
        <v-expansion-panel-text>
          <p>Yes! There are configuration examples on Github in the third party integrations folder.
            These are the currently supported stats that are emitted via REST API at /api/quickstats:
            <code>{"acknowledged_alerts": 0, "unacknowledged_alerts": 6453, "total_alerts": 6453, "unacknowledged_localhosts_count": 4, "acknowledged_localhosts_count": 44, "total_localhosts_count": 48, "ignorelist_count": 32, "average_threat_score": 32}</code>
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="How can I contribute code?">
        <v-expansion-panel-text>
          <p>
            Email homelabids@gmail.com to let us know about what features or idea you have!
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="About">
        <v-expansion-panel-text>
          <p>
            HomeLabIDS is an open-source project. For more information, visit the <a href="https://github.com/mayberryjp/homelabids" target="_blank">GitHub repository</a>. For contact by email please email homelabids@gmail.com.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";

type ConfigEntry = { key: string; value: string | number };

const configArray = ref<ConfigEntry[] | null>(null);
const config = ref<Record<string, string | number>>({});
const configError = ref<string | null>(null);

onMounted(async () => {
  try {
    const response = await api.get("/configurations");
    configArray.value = response.data;
    // Convert array to object for easy access
    config.value = Object.fromEntries(
      (configArray.value || []).map(item => [item.key, item.value])
    );
  } catch (e) {
    configError.value = "Could not load configuration.";
  }
});
</script>

<style scoped>
.configBubble {
  background: #1976d2;
  color: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  margin: 4px 8px 4px 0;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}
</style>