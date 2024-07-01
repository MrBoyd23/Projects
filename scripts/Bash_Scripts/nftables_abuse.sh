#!/bin/bash

# Run Command To Find IP Addresses With Invalid User Attempts Via SSH
invalid_ips=$(journalctl _COMM=sshd --since "1 month ago" | grep "Invalid user" | awk '{print $(NF-2)}' | sort | uniq -c | sort -nr)

# Define A Threshold For Subnet Block (More Than 10 Occurrences)
threshold=5

# Flag To Track If Any New Subnets Are Found
new_subnets_found=false

# Function To Extract Subnet From IP Address
get_subnet() {
    echo "$1" | cut -d. -f1-3
}

# Check if the comment line exists in nftables.conf
if grep -q "# Drop traffic from specific subnets" /etc/nftables.conf; then
    # Loop Through Each Line Of Invalid_IPs
    while read -r line; do
        count=$(echo "$line" | awk '{print $1}')
        ip=$(echo "$line" | awk '{print $2}')

        # Check If Count Is Above Threshold
        if [ "$count" -gt "$threshold" ]; then
            subnet=$(get_subnet "$ip")

            # Check If Subnet Is Already Blocked In nftables.conf
            if grep -q "ip saddr $subnet.0/24 drop" /etc/nftables.conf; then
                echo "Subnet $subnet.0/24 is already blocked."
            else
                # Add subnet block rule to /etc/nftables.conf below the comment line with proper indentation
                sed -i "/# Drop traffic from specific subnets/a \        ip saddr $subnet.0/24 drop" /etc/nftables.conf
                echo "Adding rule to block subnet $subnet.0/24"
                new_subnets_found=true
            fi
        fi
    done <<< "$invalid_ips"
else
    echo
    echo "Comment Line '# Drop Traffic From Specific Subnets' Not Found In /etc/nftables.conf"
    echo
fi

# Apply Changes To Nftables Configuration If New Subnets Were Found
if [ "$new_subnets_found" = true ]; then
    echo
    echo "Applying New Rules To nftables..."
    nft -f /etc/nftables.conf
    echo
else
    echo
    echo "No New Subnets Found. Not Applying Any Changes To nftables."
    echo
fi
